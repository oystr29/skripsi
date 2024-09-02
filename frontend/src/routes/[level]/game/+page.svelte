<script lang="ts">
  import { dev } from '$app/environment';
  import handd from '@mediapipe/hands';
  import { deviceIdStore } from '$lib/store';
  const { HAND_CONNECTIONS } = handd;
  import {
    FilesetResolver,
    HandLandmarker,
    type HandLandmarkerResult,
    type NormalizedLandmark
  } from '@mediapipe/tasks-vision';
  import type { DrawingOptions } from '@mediapipe/drawing_utils';
  import { createMutation, createQuery } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { handlandmarkerStore } from '$lib/store';
  import type { PageData } from '../$types';
  import { env } from '$env/dynamic/public';
  import Alertime from '$lib/components/alertime.svelte';
  import Circleprogress from '$lib/components/circleprogress.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ChevronRight } from 'svelte-radix';

  export let data: PageData;

  let videoEl: HTMLVideoElement | undefined;
  let canvasEl: HTMLCanvasElement | undefined;
  /** @type {} */
  let canvasCtx: CanvasRenderingContext2D | null | undefined;
  /** @type {}*/
  let handlandmarker: HandLandmarker | undefined;
  handlandmarkerStore.subscribe((v) => {
    handlandmarker = v;
  });
  let results: HandLandmarkerResult;
  let lastVideoTime = -1;

  type Callback<I, O> = (input: I) => O;

  /**
    @function
    @template O
    @template I
    @param {O|Callback<I, O>} value
    @param {I} data
    @returns O
  */
  function resolve<O, I>(value: O | Callback<I, O>, data: I): O {
    return value instanceof Function ? value(data) : value;
  }

  const DEFAULT_OPTIONS: DrawingOptions = {
    color: 'white',
    lineWidth: 4,
    radius: 6
  };

  function addDefaultOptions(style?: DrawingOptions): DrawingOptions {
    style = style || {};
    return {
      ...DEFAULT_OPTIONS,
      ...{ fillColor: style.color },
      ...style
    };
  }

  let video: MediaTrackConstraints | undefined;
  let dialogOpen = true;

  let seconds = 5;
  let interval: number;
  let state: 'idle' | 'run' | 'correct' | 'wrong' | 'fetching' = 'idle';

  const startInterval = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      seconds -= 0.1;
      if (seconds >= 0) return;
      // run
      if (!$mutate.isPending && seconds <= 0 && state === 'run') {
        $mutate.mutate({
          results: results.landmarks,
          letter: $query.data?.words[currIndexWords][currIndexLetters] ?? ''
        });
        // clearInterval(interval);
      } else if (
        ($mutate.isSuccess || $mutate.isError) &&
        seconds <= 0 &&
        (state === 'correct' || state === 'wrong')
      ) {
        seconds = 5;
        state = results.landmarks && !dialogOpen ? 'run' : 'idle';
        if (dialogOpen) {
          clearInterval(interval);
        }
      }
    }, 100);
  };

  let currIndexWords = 0;
  let currIndexLetters = 0;

  const query = createQuery({
    queryKey: ['words', data.level],
    queryFn: async () => {
      const res = await axios(`${env.PUBLIC_BASE_API}/words/${data.level}`);

      return res.data as { letters: string[]; words: string[] };
    }
  });

  const mutate = createMutation({
    mutationFn: async (variables: { results: NormalizedLandmark[][]; letter: string }) => {
      const res = await axios.post(`${env.PUBLIC_BASE_API}/detect`, variables, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*'
        }
      });
      return res.data as { message: string };
    },
    onMutate: async () => {
      seconds = 1;
      state = 'fetching';
      // startInterval();
    },
    onSuccess: async () => {
      // detect if not last word
      if (
        $query.data &&
        $query.data.words.length - 1 === currIndexWords &&
        $query.data.words[currIndexWords].length - 1 === currIndexLetters
      ) {
        // end
        return;
      }

      // Ubah Kata
      if ($query.data && $query.data.words[currIndexWords].length - 1 === currIndexLetters) {
        currIndexWords += 1;
        currIndexLetters = 0;
        seconds = 1;
        state = 'correct';
        startInterval();
        dialogOpen = true;
        return;
      }

      // Ubah Huruf dari kata
      currIndexLetters += 1;
      seconds = 1;
      state = 'correct';
      // startInterval();
    },
    onError: async (e) => {
      seconds = 1;
      state = 'wrong';
      startInterval();
      console.error(e);
    }
  });

  async function predictWebcam() {
    if (canvasEl && videoEl && handlandmarker && canvasCtx) {
      if (!video) {
        video = { width: videoEl.videoWidth, height: videoEl.videoHeight };
      }
      canvasEl.style.width = `${videoEl.videoWidth}`;
      canvasEl.style.height = `${videoEl.videoHeight}`;
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;

      let startTimeMs = performance.now();
      if (lastVideoTime != videoEl.currentTime) {
        lastVideoTime = videoEl.currentTime;
        results = handlandmarker.detectForVideo(videoEl, startTimeMs);
      }
      canvasCtx.save();

      // Stop kalau tangannya hilang
      if (!results?.landmarks.length && state === 'run') {
        clearInterval(interval);
        state = 'idle';
        seconds = 5;
      }

      if (results?.landmarks.length && !dialogOpen) {
        if (state === 'idle') {
          startInterval();
          state = 'run';
        }

        /*         if (!$mutate.isPending && seconds <= 0 && state === 'run') {
          $mutate.mutate({
            results: lm,
            letter: $query.data?.words[currIndexWords][currIndexLetters] ?? ''
          });
          seconds = 5;
          state = 'fetching';
        } */

        for (const landmarks of results.landmarks) {
          // draw connector
          if (!landmarks) {
            return;
          }
          const ctx = canvasCtx;
          const options = addDefaultOptions({ color: '#0284c7', lineWidth: 1 });
          ctx.save();
          const canvas = ctx.canvas;
          let index = 0;
          for (const connection of HAND_CONNECTIONS) {
            ctx.beginPath();
            const [start, end] = connection;
            const from = landmarks[start];
            const to = landmarks[end];

            if (from && to) {
              ctx.strokeStyle = resolve(options.color ?? '', { index, from, to });
              ctx.lineWidth = resolve(options.lineWidth ?? 1, { index, from, to });
              ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
              ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
            }
            ++index;
            ctx.stroke();
          }

          // draw landmarks
          const optionLandmarks = addDefaultOptions({ color: '#facc15', lineWidth: 0 });
          ctx.save();
          const canvasLandmarks = ctx.canvas;
          let indexLandmarks = 0;
          for (const landmark of landmarks) {
            // All of our points are normalized, so we need to scale the unit canvas
            // to match our actual canvas size.
            ctx.fillStyle = resolve(optionLandmarks.fillColor ?? '#00ff00', {
              index: indexLandmarks,
              from: landmark
            });
            ctx.strokeStyle = resolve(optionLandmarks.color ?? '#ffffff', {
              index: indexLandmarks,
              from: landmark
            });
            ctx.lineWidth = resolve(optionLandmarks.lineWidth ?? 0, {
              index: indexLandmarks,
              from: landmark
            });

            const circle = new Path2D();
            // Decrease the size of the arc to compensate for the scale()
            circle.arc(
              landmark.x * canvasLandmarks.width,
              landmark.y * canvasLandmarks.height,
              resolve(optionLandmarks.radius ?? 1, { index: indexLandmarks, from: landmark }),
              0,
              2 * Math.PI
            );
            /* ctx.fill(circle);
              ctx.stroke(circle); */
            ++indexLandmarks;
          }

          /*             drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 5
            }); */
          /*             drawLandmarks(canvasCtx, landmarks, {
              color: '#FF0000',
              lineWidth: 2
            }); */
        }
      }

      canvasCtx.restore();
      requestAnimationFrame(predictWebcam);
    }
  }

  onMount(async () => {
    // Before we can use HandLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    if (!handlandmarker) {
      const vision = await FilesetResolver.forVisionTasks(
        // wasm
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      handlandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: dev
            ? '/hand_landmarker.task'
            : `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 2
      });
    }
    //stream and detect it.
    canvasCtx = canvasEl?.getContext('2d');

    navigator.mediaDevices
      .getUserMedia({ video: $deviceIdStore ? { deviceId: { exact: $deviceIdStore } } : true })
      .then((stream) => {
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.addEventListener('loadeddata', predictWebcam);
        }
      });
  });
</script>

<svelte:head>
  <title>Game Level {data.level}</title>
</svelte:head>

{#if $query.data}
  <Alertime
    {dialogOpen}
    text={$query.data?.words[currIndexWords]}
    onClose={() => {
      dialogOpen = false;
    }}
  />
{/if}

<main class="flex flex-1 flex-wrap">
  <div class="basis-1/3 bg-white text-black md:h-screen relative">
    <div class="flex flex-col flex-1 items-center py-4 justify-between h-screen font-bold">
      <div class="text-2xl font-semibold">Ikuti Huruf</div>
      <div class="text-9xl font-bold text-blue-500">
        {$query.data?.words[currIndexWords][currIndexLetters] ?? ''}
      </div>
      <div class="text-4xl font-bold">
        {#each $query.data?.words[currIndexWords].split('') ?? '' as letter, i}
          <span class={i === currIndexLetters ? 'text-blue-500' : 'text-gray-500'}>{letter}</span>
        {/each}
      </div>
      <Button
        class="absolute right-2 bottom-2"
        variant="secondary"
        type="button"
        on:click={() => {
          if ($query.data && $query.data.words[currIndexWords].length - 1 === currIndexLetters) {
            currIndexWords += 1;
            currIndexLetters = 0;
            seconds = 5;
            dialogOpen = true;
            return;
          }
          currIndexLetters += 1;
          seconds = 5;
        }}
      >
        <ChevronRight class="mr-2" />
        Skip Huruf
      </Button>
    </div>
  </div>
  <div class="basis-2/3 relative">
    <div class="absolute right-2 top-1 z-[60]"></div>
    <div class="video-container">
      <div class="absolute z-30 w-28 h-28 left-2 bottom-2">
        <Circleprogress max={state === 'run' ? 5 : 1} value={seconds} {state} />
      </div>
      <video bind:this={videoEl} autoplay playsinline class="absolute video" id="">
        <track kind="captions" />
      </video>
    </div>
    <div class="video-container z-50">
      <canvas class="video absolute top-0 left-0 z-50" bind:this={canvasEl}></canvas>
    </div>
    <div class="video-container z-20">
      <div class="video bg-black/70 z-20"></div>
    </div>
  </div>
</main>

<style>
  .video-container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .video-container .video {
    /* Make video to at least 100% wide and tall */
    min-width: 100%;
    min-height: 100%;

    /* Setting width & height to auto prevents the browser from stretching or squishing the video */
    width: auto;
    height: auto;

    /* Center the video */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
    -webkit-transform: translate(-50%, -50%) rotateY(180deg);
    -moz-transform: translate(-50%, -50%) rotateY(180deg);
  }
</style>
