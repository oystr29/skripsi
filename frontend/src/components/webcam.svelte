<script>
  import drawing_utils from '@mediapipe/drawing_utils';
  const { drawConnectors, drawLandmarks } = drawing_utils;
  import hands from '@mediapipe/hands';
  const { HAND_CONNECTIONS } = hands;
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
      canvasCtx.arc(95, 50, 40, 0, 2 * Math.PI);
      canvasCtx.stroke();
      if (results?.landmarks) {
        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 5
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: '#FF0000',
            lineWidth: 2
          });
        }
      }

      canvasCtx.restore();
      window.requestAnimationFrame(predictWebcam);
    }
  }

  onMount(async () => {
    // Before we can use HandLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    const vision = await FilesetResolver.forVisionTasks(
      // wasm
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    handlandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 2
    });

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
  <div class="absolute z-40">makan</div>
  <canvas class="output_canvas absolute top-0 left-0 z-50" bind:this={canvasEl}></canvas>
</div>
