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
  <title>Level 1</title>
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
    <a href={`/${data.level}/game`}>
      <button
        class="text-3xl font-bold px-10 py-4 rounded-full bg-sky-950 text-sky-500 hover:bg-sky-500 hover:text-white"
        >Let's Go!</button
      >
    </a>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-circle-ellipsis"
          ><circle cx="12" cy="12" r="10" /><path d="M17 12h.01" /><path d="M12 12h.01" /><path
            d="M7 12h.01"
          /></svg
        ></DropdownMenu.Trigger
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
    <a href="/test-mobile">test</a>
  </div>
</main>
