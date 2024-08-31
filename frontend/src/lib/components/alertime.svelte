<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog';

  let interval: number;
  let seconds = 3;
  export let dialogOpen = false;
  export let text: string = '';
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
    if (dialogOpen) {
      console.log(`Dialog Open: ${dialogOpen}`);
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
      <AlertDialog.Title class="text-5xl text-center">{text}</AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Close</AlertDialog.Cancel>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
