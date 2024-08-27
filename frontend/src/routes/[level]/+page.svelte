<script>
  /** @type {import('./$types').PageData} */
  export let data;
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
    <p>{data.content}</p>
    <a href={`/${data.level}/game`}>
      <button
        class="text-3xl font-bold px-10 py-4 rounded-full bg-sky-950 text-sky-500 hover:bg-sky-500 hover:text-white"
        >Let's Go!</button
      >
    </a>
  </div>
</main>
