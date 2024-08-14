<script>
  import { dev } from '$app/environment';
  import handd from '@mediapipe/hands';
  const { HAND_CONNECTIONS } = handd;
  import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
  // import wasm from '@mediapipe/tasks-vision/wasm';
  import { onMount } from 'svelte';

  /** @type {HTMLVideoElement | undefined} */
  let videoEl;
  /** @type {HTMLCanvasElement | undefined} */
  let canvasEl;
  /** @type {CanvasRenderingContext2D | null | undefined} */
  let canvasCtx;
  /** @type {HandLandmarker | undefined}*/
  let handlandmarker;
  /** @type {import('@mediapipe/tasks-vision').HandLandmarkerResult | undefined} */
  let results;
  let lastVideoTime = -1;

  /**
    @template I
    @template O
    @typedef {(input: I) => O} Callback
  */

  /**
    @function
    @template O
    @template I
    @param {O|Callback<I, O>} value
    @param {I} data
    @returns O
  */
  function resolve(value, data) {
    return value instanceof Function ? value(data) : value;
  }

  /** @type {import('@mediapipe/drawing_utils').DrawingOptions}  */
  const DEFAULT_OPTIONS = {
    color: 'white',
    lineWidth: 4,
    radius: 6
  };

  /** @param {import('@mediapipe/drawing_utils').DrawingOptions | undefined} style 
      @returns {import('@mediapipe/drawing_utils').DrawingOptions}
  */
  function addDefaultOptions(style) {
    style = style || {};
    return {
      ...DEFAULT_OPTIONS,
      ...{ fillColor: style.color },
      ...style
    };
  }

  onMount(async () => {
    async function predictWebcam() {
      if (canvasEl && videoEl && handlandmarker && canvasCtx) {
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

        canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        canvasCtx.beginPath();
        canvasCtx.arc(lastVideoTime * 2, 50, 40, 0, 2 * Math.PI);
        canvasCtx.stroke();
        if (results?.landmarks) {
          for (const landmarks of results.landmarks) {
            // draw connector
            if (!landmarks) {
              return;
            }
            const ctx = canvasCtx;
            const options = addDefaultOptions({ color: '#0284c7', lineWidth: 5 });
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
                ctx.lineWidth = resolve(options.lineWidth ?? 5, { index, from, to });
                ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
                ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
              }
              ++index;
              ctx.stroke();
            }

            // draw landmarks
            const optionLandmarks = addDefaultOptions({ color: '#facc15', lineWidth: 2 });
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
              ctx.lineWidth = resolve(optionLandmarks.lineWidth ?? 5, {
                index: indexLandmarks,
                from: landmark
              });

              const circle = new Path2D();
              // Decrease the size of the arc to compensate for the scale()
              circle.arc(
                landmark.x * canvasLandmarks.width,
                landmark.y * canvasLandmarks.height,
                resolve(optionLandmarks.radius ?? 2, { index: indexLandmarks, from: landmark }),
                0,
                2 * Math.PI
              );
              ctx.fill(circle);
              ctx.stroke(circle);
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
    // Before we can use HandLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
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

    /*     hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    }); */

    // Demo 1: Continuously grab image from
    //stream and detect it.
    console.log('aku pertama');
    canvasCtx = canvasEl?.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.addEventListener('loadeddata', predictWebcam);
      }
    });
  });
</script>

<div class="bg-black relative">
  <video bind:this={videoEl} autoplay playsinline class="absolute">
    <track kind="captions" />
  </video>
  <div class="absolute z-40"></div>
  <canvas class="output_canvas absolute top-0 left-0 z-50" bind:this={canvasEl}></canvas>
</div>
