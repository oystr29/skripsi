<script lang="ts">
  import { dev } from '$app/environment';
  import { HAND_CONNECTIONS } from '$lib/hand_connection';
  import { deviceIdStore } from '$lib/store';
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
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { goto } from '$app/navigation';

  export let data: PageData;
  let windowWidth: number;

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
  let levelEnd = false;

  let seconds = 3;
  let state: 'idle' | 'run' | 'correct' | 'wrong' | 'fetching' = 'idle';

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
      state = 'fetching';
    },
    onSuccess: async () => {
      // detect if not last word
      if (
        $query.data &&
        $query.data.words.length - 1 === currIndexWords &&
        $query.data.words[currIndexWords].length - 1 === currIndexLetters
      ) {
        // end
        levelEnd = true;
        state = 'idle';
        return;
      }

      // Ubah Kata
      if ($query.data && $query.data.words[currIndexWords].length - 1 === currIndexLetters) {
        currIndexWords += 1;
        currIndexLetters = 0;
        // startInterval();
        dialogOpen = true;
        return;
      }

      // Ubah Huruf dari kata
      currIndexLetters += 1;
    },
    onError: async (e) => {
      // startInterval();
      console.error(e);
    }
  });
  let secondObj = {
    last: 0,
    now: 0
  };

  /**@param {number} nowSec */
  async function predictWebcam(nowSec) {
    try {
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

        let currSec = seconds - (nowSec - secondObj.last) / 1000;
        secondObj.now = nowSec;

        if ((state === 'correct' || state === 'wrong') && currSec < 0) {
          seconds = 3;
          state = !results.landmarks.length || !dialogOpen ? 'run' : 'idle';
          secondObj.last = nowSec;
        }

        if (($mutate.isSuccess || $mutate.isError) && state === 'fetching') {
          state = $mutate.isSuccess ? 'correct' : 'wrong';
          seconds = 1;
          secondObj.last = nowSec;
        }
        currSec = seconds - (nowSec - secondObj.last) / 1000;

        if (
          !$mutate.isPending &&
          currSec < 0 &&
          state === 'run' &&
          results.landmarks.length >= 0 &&
          !dialogOpen
        ) {
          state = 'fetching';
          $mutate.mutateAsync({
            results: results.landmarks,
            letter: $query.data?.words[currIndexWords][currIndexLetters] ?? ''
          });
        }

        // Stop kalau tangannya hilang
        if (results?.landmarks.length === 0 && state === 'run') {
          // clearInterval(interval);
          state = 'idle';
          seconds = 3;
        }

        if (results?.landmarks.length > 0 && !dialogOpen && !levelEnd) {
          if (state === 'idle') {
            // startInterval();
            state = 'run';
            secondObj.last = nowSec;
          }

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
    } catch (e) {
      console.log(e);
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

<Alertime
  {dialogOpen}
  text={$query.data?.words[currIndexWords]}
  onClose={() => {
    dialogOpen = false;
  }}
/>

<svelte:window bind:innerWidth={windowWidth} />

<!-- Kalau menang -->
<AlertDialog.Root bind:open={levelEnd}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title class="text-center">Selamat!! 🎉🎉🎉</AlertDialog.Title>
      <AlertDialog.Description>
        Kamu Sudah Menyelesaikan Level {data.level}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      {#if data.level !== '4'}
        <a href="/">
          <Button>Stop Dulu</Button>
        </a>
      {/if}
      <Button
        on:click={() => {
          if (data.level === '4') {
            goto('/');
            return;
          }

          goto(`/${Number(data.level) + 1}`);
          levelEnd = false;
        }}>{data.level === '4' ? 'Selesai' : 'Lanjut'}</Button
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

{#if windowWidth <= 400}
  <div class="bg-white h-1/3 absolute w-screen z-[60] text-black">
    <div class="w-full h-full flex flex-col items-center justify-between">
      <div class="font-bold">Ikuti Huruf</div>
      <div class="px-2 grid grid-cols-3 gap-4 items-center justify-between w-full">
        <div class="">
          <img
            src={`${env.PUBLIC_BASE_API}/static/img/letters/${$query.data?.words[currIndexWords][currIndexLetters]}.png`}
            class=""
          />
        </div>
        <div class="text-7xl flex items-center justify-center w-full text-blue-500">
          {$query.data?.words[currIndexWords][currIndexLetters] ?? ''}
        </div>
        <div class="flex items-center justify-center h-full w-full">
          <Circleprogress max={state === 'run' ? 5 : 1} value={seconds} {state} />
        </div>
      </div>

      <div class="text-2xl font-bold">
        {#each $query.data?.words[currIndexWords].split('') ?? '' as letter, i}
          <span class={i === currIndexLetters ? 'text-blue-500' : 'text-gray-500'}>{letter}</span>
        {/each}
      </div>
    </div>
  </div>
  <video
    bind:this={videoEl}
    autoplay
    playsinline
    class="w-screen flip-video h-screen object-cover absolute"
    id=""
  >
    <track kind="captions" />
  </video>
  <canvas class="absolute flip-video h-screen w-screen object-cover z-50" bind:this={canvasEl} />
  <div class="bg-black/70 absolute w-screen h-screen z-40 object-cover" />
{:else}
  <main class="flex flex-1 flex-wrap">
    <div class="basis-1/3 bg-white text-black md:h-screen relative">
      <div class="flex flex-col flex-1 items-center py-4 justify-between h-screen font-bold">
        <div class="text-2xl font-semibold">Ikuti Huruf</div>
        <div class="flex flex-col">
          <p>now: {secondObj.now}</p>
          <p>last: {secondObj.last}</p>
        </div>
        <div class="flex items-center px-2 justify-center gap-4 w-full flex-col">
          <div class="w-64 h-64">
            <img
              src={`${env.PUBLIC_BASE_API}/static/img/letters/${$query.data?.words[currIndexWords][currIndexLetters]}.png`}
              class=""
            />
          </div>
          <div class="text-9xl font-bold text-blue-500">
            {$query.data?.words[currIndexWords][currIndexLetters] ?? ''}
          </div>
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
              seconds = 3;
              dialogOpen = true;
              return;
            }
            currIndexLetters += 1;
            seconds = 3;
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
          <Circleprogress
            max={state === 'run' ? seconds : 1}
            value={seconds - (secondObj.now - secondObj.last) / 1000}
            {state}
          />
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
{/if}

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

  .flip-video {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
  }

  .border-sketch {
    border-top-left-radius: 255px 15px;
    border-top-right-radius: 15px 225px;
    border-bottom-right-radius: 225px 15px;
    border-bottom-left-radius: 15px 255px;
  }
</style>
