<script>
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { deviceIdStore } from '$lib/store';
  import { onMount } from 'svelte';
  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {MediaDeviceInfo[]} */
  let optionsCamera = [];
  onMount(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      optionsCamera = videoDevices;
      if (!$deviceIdStore) $deviceIdStore = videoDevices[0].deviceId;
    });
  });
</script>

<svelte:head>
  <title>Level {data.level}</title>
</svelte:head>

<header class="fixed p-2 w-full">
  <nav class="container mx-2 md:mx-auto flex items-center justify-center">
    <div class="font-bold text-4xl text-white">ISYARAT BISINDO</div>
  </nav>
</header>

<main
  class="pt-56 container text-white mx-auto flex flex-col items-center justify-between h-screen pb-10"
>
  <div class="flex flex-col items-center gap-10">
    <h1 class="text-8xl mb-4 font-bold">{data.title}</h1>
    <p class="text-lg">
      Kamu akan mempelajari <span class="text-sky-500 font-bold">{data.content}</span>
    </p>
    <p class="text-sm">{data.ket}</p>
    <a href={`/${data.level}/game`}>
      <button
        class="text-3xl font-bold px-10 py-4 rounded-full bg-sky-950 text-sky-500 hover:bg-sky-500 hover:text-white"
        >Let's Go!</button
      >
    </a>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        ><svg
          class="w-10 h-10 text-gray-600 hover:text-gray-50"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 56 56"
        >
          <path
            fill="currentColor"
            d="M28 51.906c13.055 0 23.906-10.851 23.906-23.906c0-13.078-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.922 4.095 28c0 13.055 10.828 23.906 23.906 23.906M17.687 38.57c-2.507 0-3.773-1.242-3.773-3.68V22.376c0-2.461 1.266-3.703 3.773-3.703h2.696c.937 0 1.218-.211 1.758-.774l.96-1.078c.61-.656 1.22-1.008 2.438-1.008h4.781c1.219 0 1.828.352 2.414 1.008l.961 1.078c.54.61.82.774 1.758.774h2.813c2.46 0 3.75 1.242 3.75 3.703v12.516c0 2.437-1.29 3.68-3.75 3.68Zm10.149-3.328c3.89 0 7.008-3.047 7.008-7.054a6.98 6.98 0 0 0-7.008-7.008c-3.89 0-7.055 3.117-7.055 7.008a7.03 7.03 0 0 0 7.055 7.054m9.21-10.172c.868 0 1.595-.703 1.571-1.593c0-.891-.703-1.594-1.57-1.594s-1.594.703-1.594 1.594c0 .89.727 1.593 1.594 1.593m-9.21 8.133a5.006 5.006 0 0 1-5.016-5.016c0-2.765 2.25-4.992 5.016-4.992a4.996 4.996 0 0 1 4.992 4.993a5 5 0 0 1-4.992 5.015"
          />
        </svg></DropdownMenu.Trigger
      >
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Ganti Kamera</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup bind:value={$deviceIdStore}>
            {#each optionsCamera as opt}
              <DropdownMenu.RadioItem value={opt.deviceId}>{opt.label}</DropdownMenu.RadioItem>
            {/each}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</main>
