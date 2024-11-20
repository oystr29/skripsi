<script>
  import { onMount } from 'svelte';

  import Reveal from 'reveal.js';
  import Highlight from 'reveal.js/plugin/highlight/highlight';
  import Markdown from 'reveal.js/plugin/markdown/markdown';
  import Notes from 'reveal.js/plugin/notes/notes';

  import 'reveal.js/dist/reveal.css';
  import 'reveal.js/dist/theme/black.css';
  import 'reveal.js/plugin/highlight/monokai.css';

  onMount(() => {
    Reveal.initialize({
      plugins: [Markdown, Highlight, Notes],
      autoAnimateEasing: 'ease',
      autoAnimateDuration: 1,
      hash: true
      // controls: false,
      // progress: false
    });
  });
</script>

<svelte:head>
  <title>Semhas</title>
</svelte:head>

<div class="reveal">
  <div class="slides">
    <section>
      <h6 class="text-bold">
        Implementasi SVM Pada <i>Hand Landmark</i> Alfabet BISINDO Menggunakan Mediapipe
      </h6>
      <div class="r-stack">
        <img src="/unmul-alpha.png" width="120" alt="logounmul" />
      </div>
      <p>Oktavian Yoga Syahputra</p>
      <p>Prodi Informatika</p>
      <p>Fakultas Teknik</p>
      <p>Universitas Mulawarman</p>
      <p>2024</p>
    </section>
    <section>
      <section>
        <h3>Revisi Pembimbing & Penguji</h3>
      </section>
      <section>
        <h4>Bu Anindita</h4>
        <ul>
          <li class="fragment">Paragraf min. 2 kalimat</li>
          <li class="fragment">Source code jangan gambar</li>
        </ul>
      </section>
      <section>
        <h4>Bu Masnawati</h4>
        <li class="fragment">Paragraf min. 2 kalimat</li>
        <li class="fragment">Source code jangan gambar</li>
      </section>
    </section>
  </div>
</div>
