<script>
  import { deviceIdStore } from '$lib/store';
  import { onMount } from 'svelte';

  /** @type {HTMLVideoElement | undefined} */
  let videoEl;

  onMount(() => {
    navigator.mediaDevices
      .getUserMedia({ video: $deviceIdStore ? { deviceId: { exact: $deviceIdStore } } : true })
      .then((stream) => {
        if (videoEl) {
          videoEl.srcObject = stream;
          // videoEl.addEventListener('loadeddata', predictWebcam);
        }
      });
  });
</script>

<video bind:this={videoEl} autoplay playsinline class="video" id="">
  <track kind="captions" />
</video>
