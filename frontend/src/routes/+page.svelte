<script>
</script>

<svelte:head>
  <title>Isyarat BISINDO</title>
</svelte:head>

<header class="fixed p-2 w-full">
  <nav class="container mx-2 md:mx-auto flex items-center justify-center">
    <div class="font-bold text-4xl text-white">ISYARAT BISINDO</div>
  </nav>
</header>
<main
  class="pt-48 lg:pt-56 container mx-auto flex flex-col items-center justify-between h-screen pb-10"
>
  <div class="flex flex-col items-center">
    <div class="flex flex-col items-center gap-4">
      <a href="/1">
        <button class="btn mr-8">Level 1</button>
      </a>
      <a href="/2">
        <button class="btn ml-8">Level 2</button>
      </a>
      <a href="/3">
        <button class="btn mr-8">Level 3</button>
      </a>
      <a href="/4">
        <button class="btn ml-8">Level 4</button>
      </a>
    </div>
  </div>
  <div class="flex items-center justify-center w-full gap-5">
    <a href="/about">
      <button class="text-white hover:underline text-4xl font-bold">About</button>
    </a>
    <div class="text-4xl">|</div>
    <a href="/report">
      <button class="text-white hover:underline text-4xl font-bold">Report</button>
    </a>
  </div>
</main>
