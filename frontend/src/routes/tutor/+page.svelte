<svelte:head>
  <title>Tutorial</title>
</svelte:head>

<main
  class="prose dark:prose-invert lg:prose-lg xl:prose-xl 2xl:prose-2xl pt-10 container mx-auto flex flex-col items-center justify-between h-screen pb-10"
>
  <div class="flex flex-col">
    <h1 class="text-center">Tutorial</h1>
    <ol>
      <li>
        Pada <a target="_blank" href="/">halaman utama</a>, silahkan pilih level. Untuk saat ini
        pilih aja dulu <a href="/1">level 1</a> <br />
        <img src="/tutor/halaman-utama.png" alt="halaman utama" class="border h-96" />
      </li>
      <li>
        Pada <a href="/1" target="_blank">level satu</a>, kalian akan diberitahu bahwa akan
        memperagakan beberapa alfabet BISINDO. <br />
        Kalian harus mengizinkan kamera dulu. <br />
        <img src="/tutor/izin-cam.png" class="border h-96" alt="izin cam" /> <br />
      </li>
      <li>
        Setelah kamera dizinkan, kalian bisa menekan tombol <span class="text-red-500"
          >"Let's Go!"</span
        >
        untuk memulai pemeragaan. Kalian juga bisa memilih sumber kamera dengan menekan
        <span class="text-green-500">icon kamera.</span> <br />
        <img alt="letsgo" src="/tutor/letsgo.png" class="border h-96" />
      </li>
      <li>
        Di halaman pemeragaan, kalian akan melihat beberapa hal:
        <ul>
          <li>
            <span class="text-red-500">Gambar Alfabet BISINDO</span> yang harus kalian peragakan
          </li>
          <li>
            <span class="text-green-500">Alfabet dari gambar diatas</span>
          </li>
          <li>
            <span class="text-blue-500">Kata yang huruf-hurufnya akan kalian peragakan</span>
          </li>
          <li>
            <span class="text-yellow-500">Tombol untuk skip huruf</span> yang kalian peragakan sekarang
          </li>
        </ul>
        (Warna huruf sesuai dengan panah pada gambar)
        <br />
        <img alt="pemeragaan" src="/tutor/pemeragaan.png" class="border h-80" />
      </li>
      <li>
        Kalian cukup arahkan tangan kalian ke kamera, maka akan muncul <span class="text-red-500"
          >titik-titik biru di tangan kalian</span
        >, ikuti gerakan tangan seperti pada gambar dan tunggu selama
        <span class="text-green-500">3 detik</span> <br />
        <img alt="blue" src="/tutor/peraga-blue.png" class="border h-80" />
      </li>
      <li>
        Jika pemeragaan kalian tidak sesuai dengan gambar, maka <span class="text-red-500"
          >titik-titik pada tangan akan berubah menjadi merah</span
        >, <span class="text-green-500">indikator waktu juga berwarna merah</span> dan akan muncul
        <span class="text-blue-500">alert error bertulisan "Gagal Memperagakan Huruf"</span>
        <img alt="failed" src="/tutor/peraga-red.png" class="border h-80" />
      </li>
      <li>
        Dan apabila kalian berhasil memperagakan gerakan pada gambar, maka <span
          class="text-red-500">titik-titik pada tangan akan berubah menjadi hijau</span
        >, <span class="text-green-500">indikator waktu juga berwarna hijau</span> dan akan muncul
        <span class="text-blue-500">alert success bertulisan "Berhasil Memperagakan Huruf"</span>
        <img alt="success" src="/tutor/peraga-green.png" class="border h-80" />
      </li>
      <li>
        Jika kalian bisa memperagakan huruf sampai selesai maka akan muncul <b>alert dialog</b>
        bertuliskan "Selamat", "Kamu telah menyelesaian level 1"
        <img alt="done" src="/tutor/done.png" class="border h-80" />
      </li>
      <li>Sisanya bisa kalian eksplor sendiri ;)</li>
    </ol>
  </div>
</main>
