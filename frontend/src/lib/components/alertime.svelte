<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Reload from 'svelte-radix/Reload.svelte';

  let interval: number;
  let seconds = 3;
  export let dialogOpen = false;
  export let text: string | undefined;
  export let onClose = () => {};

  const startInterval = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      seconds -= 0.1;
      if (seconds <= 0) {
        onClose();
        clearInterval(interval);
        seconds = 3;
      }
    }, 100);
  };

  $: {
    if (dialogOpen && text) {
      startInterval();
    }
  }
</script>

<AlertDialog.Root bind:open={dialogOpen}>
  <AlertDialog.Content>
    <div
      style={`width: ${seconds * (100 / 3)}%`}
      class="indicator transition-all absolute w-full h-2 bg-blue-700"
    ></div>
    <AlertDialog.Header>
      {#if text}
        <AlertDialog.Title class="text-lg text-center text-gray-500"
          >Kata Selanjutnya:</AlertDialog.Title
        >
        <AlertDialog.Title class="text-5xl text-center">{text}</AlertDialog.Title>
      {:else}
        <div class="flex items-center justify-center w-full">
          <Reload class="h-10 w-10 animate-spin" />
        </div>
      {/if}
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Close</AlertDialog.Cancel>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
