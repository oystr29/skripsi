<script>
  import { onMount } from 'svelte';

  import Reveal from 'reveal.js';
  import Highlight from 'reveal.js/plugin/highlight/highlight';
  import Notes from 'reveal.js/plugin/notes/notes';
  import Search from 'reveal.js/plugin/search/search';
  import Math from 'reveal.js/plugin/math/math';
  import Zoom from 'reveal.js/plugin/zoom/zoom';

  import 'reveal.js/dist/reveal.css';
  import 'reveal.js/dist/theme/dracula.css';
  import 'reveal.js/plugin/highlight/monokai.css';

  onMount(() => {
    const reveal = new Reveal({
      plugins: [Math.KaTeX, Highlight, Notes, Search, Zoom],
      autoAnimateEasing: 'ease',
      autoAnimateDuration: 1,
      hash: true,
      parallaxBackgroundImage: '/gf-tftmn.jpeg',
      // parallaxBackgroundSize: '900px 900px',
      parallaxBackgroundHorizontal: 200
      // controls: false,
      // progress: false
    });

    reveal.initialize();
  });
</script>

<svelte:head>
  <title>Pendadaran</title>
</svelte:head>

<div class="reveal">
  <div class="slides">
    <!-- Cover -->
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
    <!-- Revisi Pembimbing -->
    <section>
      <section>
        <h3>Revisi Pembimbing & Penguji</h3>
      </section>
      <section class="text-lg">
        <h4 class="capitalize text-xl">
          <span class="text-red-500">Bu Anindita</span>,
          <span class="text-purple-500">Bu Masna</span>,
          <span class="text-blue-500">Pak Raji</span>,
          <span class="text-yellow-500">Bu Ummul</span>
        </h4>
        <div class="flex gap-10 flex-wrap">
          <div>
            <p>BAB I</p>
            <ul>
              <li class="fragment text-purple-500">
                Tujuan penelitian lebih ke 'menerapkan model' ketimbang 'membuat model'
              </li>
              <li class="fragment text-blue-500">
                Manfaat penelitian ke masyarakat ke pihak yang langsung menggunakan
              </li>
            </ul>
          </div>
          <div>
            <p>BAB II</p>
            <ul>
              <li class="fragment text-purple-500">Caption di tabel gak usah dikasih jarak</li>
              <li class="fragment text-blue-500">Simbol pada gambar flowchart salah</li>
            </ul>
          </div>
          <div>
            <p>BAB III</p>
            <ul>
              <li class="fragment text-blue-500">Kasih gambar setiap dataset</li>
              <li class="fragment text-blue-500">Lebih Jelaskan tabel kriteria</li>
              <li class="fragment text-yellow-500">Diagram sistem jadi Arsitektur Sistem</li>
              <li class="fragment text-yellow-500">Pindah user ke no.1</li>
              <li class="fragment text-blue-500">Jelaskan semua level mockup halaman</li>
            </ul>
          </div>
          <div>
            <p>BAB IV (konsul)</p>
            <ul>
              <li class="fragment text-blue-500">
                Jelaskan kenapa gambar berkurang saat ekstrasi landmark menggunakan mediapipe
              </li>
              <li class="fragment text-blue-500">Jelaskan tabel hasil titik koordinat</li>
              <li class="fragment text-yellow-500">Tambahkan juga yang satu tangan</li>
              <li class="fragment text-purple-500">Kasih liat semua output landmark</li>
              <li class="fragment text-yellow-500">
                Ada indikator yang memberitahu berhasil/gagal
              </li>
              <li class="fragment text-yellow-500">
                Beri tahu jika sistem dapat diakses di tautan mana
              </li>
              <li class="fragment text-purple-500">Jelaskan tabel confusion matrix</li>
              <li class="fragment text-yellow-500">
                Di pembahasan jelaskan hal-hal yang kesebut di atas
              </li>
            </ul>
          </div>
          <div>
            <p>BAB V</p>
            <ul>
              <li class="fragment text-purple-500">Sebut metode lain selain SVM</li>
            </ul>
          </div>
        </div>
      </section>
    </section>
    <!-- BAB I -->
    <section>
      <section>
        <h3>BAB I Pendahuluan</h3>
      </section>
      <section data-auto-animate>
        <h4>Latar Belakang.</h4>
        <ul class="text-lg">
          <li class="">
            BISINDO adalah bahasa isyarat yang digunakan oleh komunitas tuli di Indonesia
          </li>
          <li class="fragment custom blur">
            Tetapi <b>belum disadari</b> masyarakat umum karena <i>language barrier</i>
          </li>
          <li class="fragment custom blur">
            <i>Language barrier</i> dapat dikecilkan dengan cara pengenalan bahasa isyarat berbasis teknologi
            yang interaktif dengan teknologi pendeteksi citra BISINDO
          </li>
        </ul>
      </section>
      <section>
        <h4>Latar Belakang..</h4>
        <ul class="text-lg">
          <li class="fragment">
            Teknologi pendeteksi citra BISINDO masih memiliki kendala dalam segmentasi objek dengan
            latar belakang
          </li>
          <li class="fragment">
            Sehingga diperlukan klasifikasi bahasa isyarat menggunakan metode Support Vector Machine
            (SVM)
          </li>
          <li class="fragment">
            Klasifikasi SVM dilakukan pada hand landmark gambar alfabet BISINDO yang didapatkan dari
            Mediapipe
          </li>
          <li class="fragment">
            Hasil klasifikasi lalu menjadi model alfabet BISINDO yang kemudian diimplementasikan
            pada sistem pemeraga alfabet BISINDO.
          </li>
        </ul>
      </section>
      <section>
        <h4>Rumusan Masalah</h4>
        <p>
          Bagaimana implementasi model klasifikasi alfabet BISINDO menggunakan metode SVM yang
          kemudian diaplikasikan pada sebuah sistem pemeragaan alfabet BISINDO?
        </p>
      </section>
      <section>
        <h4>Batasan Masalah</h4>
        <ol class="text-xl">
          <li>
            Data bahasa isyarat yang dipakai berasal dari website kaggle.com yang berisikan 26 huruf
            alfabet.
          </li>
          <li>
            Alfabet yang menggunakan gerakan seperti huruf J akan menggunakan bentuk akhir gerakan
            dan huruf R akan menampilkan bentuk awal dari gerakannya.
          </li>
          <li>
            Bentuk implementasi SVM berupa sebuah model alfabet BISINDO. Sedangkan implementasi dari
            model alfabet BISINDO berupa sebuah sistem pemeragaan alfabet BISINDO.
          </li>
        </ol>
      </section>
      <section>
        <h4>Tujuan Penelitian</h4>
        <p class="text-xl">
          Membuat model klasifikasi alfabet Bahasa Isyarat Indonesia menggunakan metode Support
          Vector Machine berdasarkan fitur hand landmark 3D dari Mediapipe yang kemudian model
          tersebut diimplementasikan dalam bentuk sistem.
        </p>
      </section>
      <section>
        <h4>Manfaat Penelitian</h4>
        <p class="text-xl">
          <b>Penulis:</b> Mengembangkan wawasan penulis mengenai pembuatan model bahasa isyarat Indonesia
          dan penerapan metode Support Vector Machine dalam klasifikasi bahasa isyarat Indonesia menggunakan
          Mediapipe serta bagaimana cara aplikasi model pada sebuah sistem
        </p>
        <p class="text-xl">
          <b>Mahasiswa:</b> Memberikan pengetahuan dan referensi kepada mahasiswa tentang bagaimana metode
          Support Vector Machine diterapkan di dalam pembuatan sebuah model bahasa isyarat Indonesia
          serta aplikasi model pada sebuah sistem
        </p>
        <p class="text-xl">
          <b>Komunitas Tuli:</b> Manfaat penelitian ini bagi lembaga komunitas tuli adalah dapat meningkatkan
          kesadaran masyarakat dengar akan bahasa isyarat Indonesia
        </p>
      </section>
      <section>
        <h4>Kontribusi Penelitian</h4>
        <p>
          Sebuah model yang dapat mengklasifikasikan BISINDO menggunakan metode SVM serta aplikasi
          model pada sebuah sistem sehingga lebih banyak teknologi dan penelitian tentang bahasa
          isyarat Indonesia guna memperkecil jarak antara masyarat tuli dan masyarakat dengar
        </p>
      </section>
    </section>
    <!-- BAB II -->
    <section>
      <section>
        <h3>BAB II Tinjauan Pustaka</h3>
      </section>
      <section>
        <h4>Penelitian Terkait.</h4>
        <ul>
          <li>(H. Putri & Fuadi, 2020): Pendeteksian BISINDO Secara Real-Time Menggunakan LSTM</li>
          <li>
            (Novianty & Azmi, 2021): Sign Language Recognition using Principal Component Analysis
            and SVM
          </li>
          <li>(Aziz, 2021): Image Recognition Alfabet BISINDO Menggunakan Metode CNN</li>
          <li>
            (Syah & Witanti, 2022): Analisis Sentimen Masyarakat Terhadap Vaksinasi Covid-19 Pada
            Media Sosisal Twitter Menggunakan Metode SVM
          </li>
          <li>
            (Kusuma dkk., 2022): Komparasi Algoritma SVM dan Naive Bayes pada Klasifikasi Ras Kucing
          </li>
        </ul>
      </section>
      <section>
        <h4>Penelitian Terkait..</h4>
        <ul>
          <li>
            (Chusna dkk., 2022): Klasifikasi Citra Jenis Tanaman Jamur Layak Konsumsi Menggunakan
            Algoritma MSVM
          </li>
          <li>
            (H. Putri dkk., 2023): Rancang Bangun Sistem Identifikasi Kesegaran Ikan Berdasarkan
            Citra Mata Menggunakan SVM
          </li>
          <li>
            (Alexander dkk., 2023): Penggunaan Machine Learning Dalam Klasifikasi BISINDO
            Menggunakan Kamera
          </li>
          <li>
            (Kulsumarwati dkk., 2021): Penerapan SVM dan Information Gain pada Analisis Sentimen
            Pelaksanaan Pilkada saat Pandemi.
          </li>
          <li>
            (Robert dkk., 2023): Sistem Pendeteksi Gerakan BISINDO Menggunakan Webcam dengan Metode
            Supervised Learing
          </li>
        </ul>
      </section>
      <section>
        <h4>Bahasa Isyarat Indonesia</h4>
        <ul>
          <li>
            Bahasa Isyarat Indonesia atau BISINDO merupakan bahasa murni sahabat tuli di Indonesia
            (Dewi dkk., 2021).
          </li>
          <li>
            Bahasa murni dapat diartikan sebagai bahasa yang berkembang secara alami dari komunitas
            penggunanya, tanpa campur tangan dari pihak luar.
          </li>
        </ul>
      </section>
      <section>
        <h4>Support Vector Machine</h4>
        <p>
          <b>SVM</b> adalah metode <b>klasifikasi</b> yang mencari garis atau permukaan pemisah yang
          memiliki jarak terbesar antara dua kelas data terdekat dalam suatu ruang pemisah yang
          dikenal sebagai <b>hyperplane</b> (Pamungkas dkk., 2020)
        </p>
      </section>
      <section>
        <h4>Confussion Matrix</h4>
        <p>
          <b>Confusion matriks</b> adalah metode untuk mengukur kinerja deteksi objek seperti
          <b>akurasi</b>,
          <b>presisi</b>, dan <b>recall.</b>
        </p>
      </section>
      <section>
        <h4>Python</h4>
        <p>
          Python adalah bahasa pemrograman interpretatif yang mudah dipelajari, berfokus pada
          keterbacaan kode serta python bersifat multi platform
        </p>
      </section>
      <section>
        <h4>Framework Svelte</h4>
        <ul>
          <li>
            Svelte adalah sebuah User Interface (UI) Framework untuk bahasa pemrograman javascript.
          </li>
          <li>
            Svelte dibuat oleh Rich Harris dan dirilis pada 2016 dengan fokus utama peningkatan
            performa dibandingkan dengan solusi yang ada (Paakkanen, 2023).
          </li>
        </ul>
      </section>
      <section>
        <h4>Mediapipe</h4>
        <p>
          Mediapipe merupakan suatu library open source yang dirancang oleh Google. Mediapipe dapat
          digunakan sebagai pipeline untuk melakukan inferensi dari data citra (Lugaresi dkk.,
          2019).
        </p>
      </section>
    </section>
    <!-- BAB III -->
    <section>
      <section>
        <h3>Bab 3 Metodologi Penelitian</h3>
      </section>
      <section>
        <h4>Tahapan Pelaksanaan Penelitian</h4>
        <div class="r-stack bg-white">
          <img alt="tahapan" src="/diagram-tahapan.drawio.png" />
        </div>
      </section>
      <section>
        <h4>Pengumpulan Data</h4>
        <ul>
          <li class="fragment">Data didapat dari kaggle</li>
          <li class="fragment">Total berjumlah 11.470 gambar, (9.169 latih)(2.301 uji)</li>
        </ul>
      </section>
      <section>
        <h4>Perancangan Data</h4>
        <img alt="hand-landmark" src="/presentation-landmark.png" />
      </section>
      <section>
        <h4>Perancangan Proses</h4>
        <h5>Flowchart Modeling</h5>
        <div class="r-stack">
          <img class="h-3/4" alt="svm" src="/diagram-svm.png" />
        </div>
      </section>
      <section>
        <h5>Flowchart Modeling</h5>
        <div class="r-stack">
          <img class="" alt="svm" src="/diagram-sistem.png" />
        </div>
      </section>
      <section>Perancangan Tampilan</section>
      <section>
        <h4>Perancangan pengujian model</h4>
        <ul>
          <li>Memprediksi model menggunakan data uji.</li>
          <li>
            Mencari nilai True Positive, True Negative, False Positive, dan False Negative tiap
            label.
          </li>
          <li>
            Menghitung nilai precission, recall, dan f1-score menggunakan persamaan 2.14, 2.15, dan
            2.15 untuk tiap label.
          </li>
          <li>
            Menghitung nilai accuracy menggunakan persamaan 2.13 dan mencari nilai rata-rata
            precission, recall, dan f1-score.
          </li>
        </ul>
      </section>
      <section>
        <h4>Pengujian blackbox</h4>
        <table class="text-xl">
          <tbody>
            <tr>
              <th>No</th>
              <th>Fitur yang diuji</th>
              <th>Skenario</th>
              <th>Hasil yang diharapkan</th>
            </tr>
            <tr>
              <td>1</td>
              <td>Halaman Depan</td>
              <td>-</td>
              <td>Pengguna melihat pilihan level</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Halaman Detail Level</td>
              <td>Mengizinkan kamera</td>
              <td>Pengguna dapat melihat pilihan kamera</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Menirukan gerakan alfabet BISINDO</td>
              <td>-</td>
              <td>Pengguna dapat melihat apakah gerakan yang diperagakan benar atau tidak</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
    <!-- BAB IV -->
    <section>
      <section>
        <h3>BAB IV Hasil & Pembahasan</h3>
      </section>
      <section>
        <h4>Pengolahan Data</h4>
        <ul class="text-3xl">
          <li>Ekstrasi koordinat <i>landmark</i> dengan Mediapipe</li>
          <pre>
            <code>
# MediaPipe Hands init, mp = mediapipe
mp_hands = mp.solutions.hands.Hands(
            static_image_mode=True, 
            max_num_hands=2, 
            min_detection_confidence=0.26)
            </code>
          </pre>
          <li>Normalisasi koordinat <i>landmark</i> dengan <b>min-max</b></li>
          <pre>
            <code class="text-xs h-full" data-line-numbers="17-20,23-24,27-29">
# Hand Data Points retrieving
def detect_hand_data_points(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # HDP detection
    results = mp_hands.process(image_rgb)

    hand_data_points = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Coordinates extractions
            landmarks = hand_landmarks.landmark
            for landmark in landmarks:
                min_x = min([landmark.x for landmark in landmarks])
                max_x = max([landmark.x for landmark in landmarks])
                min_y = min([landmark.y for landmark in landmarks])
                max_y = max([landmark.y for landmark in landmarks])

                # Width & Height of the Hand Bounding Box
                bbox_width = max_x - min_x
                bbox_height = max_y - min_y

                # Normalization of x / y landmarks coordinates in the bounding box.
                normalized_lm_x = (landmark.x - min_x) / bbox_width
                normalized_lm_y = (landmark.y - min_y) / bbox_height
                hand_data_points.append((normalized_lm_x, normalized_lm_y, landmark.z))

    return hand_data_points
            </code>
          </pre>
        </ul>
      </section>
      <section>
        <h4>Pengolahan Data..</h4>
        <ul>
          <li>Data <i>landmark</i> yang panjangnya 21 akan ditambahkan nilai 0.0</li>
          <li>Hal ini dilakukan agar panjang setiap data berjumlah 42</li>
          <li>Total data berkurang 3.573, dari 11.470 ke 7.897</li>
        </ul>
      </section>
      <section data-auto-animate>
        <h4>Penerapan Proses</h4>
        <h5 class="text-xl">Pembuatan Model</h5>
        <ul>
          <li class="fragment"><b>Model</b> yang dibuat <b>berjumlah dua model</b></li>
          <li class="fragment">
            <b>Model</b> yang menggunakan <b>2 tangan</b> & <b>model</b> yang menggunakan
            <b>1 tangan</b>
          </li>
          <li class="fragment">
            Jika digabung, model cenderung memprediksi huruf yang menggunakan 2 tangan sebagai huruf
            1 tangan
          </li>
        </ul>
      </section>
      <section data-auto-animate>
        <h4>Pembuatan Model</h4>
        <ul>
          <li class="fragment">
            Model klasifikasi menggunakan SVM fungsi kernel <i>polynomial</i>
          </li>
          <li class="fragment">Hasil klasifikasi disimpan pada file .pkl</li>
        </ul>
      </section>
      <section>
        <h4>Pembuatan Sistem bagian <i>back-end</i></h4>
        <ul>
          <li class="fragment"><i>Back-end</i> dibuat menggunakan framework Python <b>Flask</b></li>
          <li class="fragment">Bertujuan untuk menormalisasi data sebelum diprediksi model</li>
          <li class="fragment">Menyediakan API untuk diaskses <i>front-end</i></li>
        </ul>
      </section>
      <section>
        <h5>Pembuatan Tampilan Web</h5>
        <a href="/" target="_blank" class="hover:underline">Klik Disini</a>
      </section>
      <section data-auto-animate>
        <h4>Hasil Pengujian</h4>
        <h5 class="text-xl">Confussion Matrix</h5>
        <p>Tabel <i>confussion matrix</i> untuk <b>model</b> yang menggunakan <b>1 tangan</b></p>
        <div class="r-stack">
          <img class="h-96" src={`https://isyarat.ankcode.com/static/img/cm/cm1.png`} alt={`cm1`} />
        </div>
      </section>
      <section data-auto-animate>
        <h5 class="">Confussion Matrix</h5>
        <p>Tabel <i>confussion matrix</i> untuk <b>model</b> yang menggunakan <b>2 tangan</b></p>
        <div class="r-stack">
          <img class="h-96" src={`https://isyarat.ankcode.com/static/img/cm/cm2.png`} alt={`cm2`} />
        </div>
      </section>
      <section>
        <h5>Perhitungan <b>akurasi</b> dari kedua model</h5>
        <ul>
          <li><b>Akurasi(2)</b> = (782/834)*100% = <b>93,76%</b></li>
          <li><b>Akurasi(1)</b> = (776/780)*100% = <b>99,49%</b></li>
        </ul>
      </section>
      <section>
        <h5>Nilai rata-rata model 2 tangan</h5>
        <ul>
          <li><b>f1-score</b> = (1.482,66/16)*100% = <b>92,67%</b></li>
          <li><b>precission</b> = (1.483,95/16)*100% = <b>92,75%</b></li>
          <li><b>recall</b> = (1.484,33/16)*100% = <b>92,77%</b></li>
        </ul>
      </section>
      <section>
        <h5>Nilai rata-rata model 1 tangan</h5>
        <ul>
          <li><b>f1-score</b> = (994,88/10)*100% = <b>99,49%</b></li>
          <li><b>precission</b> = (994,89/10)*100% = <b>99,49%</b></li>
          <li><b>recall</b> = (994,94/10)*100% = <b>99,49%</b></li>
        </ul>
      </section>
      <section>
        <h5>Blackbox</h5>
        <table class="r-stack text-lg">
          <tbody>
            <tr>
              <th>No</th>
              <th>Fitur yang diuji</th>
              <th>Skenario</th>
              <th>Hasil yang diharapkan</th>
              <th>Hasil Pengujian</th>
              <th>Keterangan</th>
            </tr>
            <tr>
              <td>1</td>
              <td>Halaman depan</td>
              <td>-</td>
              <td>Melihat pilihan level</td>
              <td>Berhasil melihat pilihan level</td>
              <td>Sesuai</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Halaman Mengizinkan Kamera</td>
              <td>Mengizinkan Kamera</td>
              <td>Melihat pilihan kamera</td>
              <td>Berhasil melihat pilihan kamera</td>
              <td>Sesuai</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Halaman pemeragaan</td>
              <td>Menirukan gerakan alfabet BISINDO</td>
              <td>Melihat gerakan yang diperagakan benar atau salah</td>
              <td>Berhasil melihat gerakan yang diperagakan benar atau salah</td>
              <td>Sesuai</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h4>Pembahasan</h4>
        <ul class="text-2xl">
          <li class="fragment">Data diperoleh dari kaggle.com</li>
          <li class="fragment">Data latih 9.169 gambar, data uji 2.301</li>
          <li class="fragment">
            Setelah dideteksi Mediapipe, data latih 6.283 txt, data uji 1.614 txt
          </li>
          <li class="fragment">Klasifikasi menggunakan SVM fungsi kernel <i>polynomial</i></li>
          <li class="fragment">Model berjumlah dua, model 2 tangan & model 1 tangan</li>
          <li class="fragment">
            <b>Hasil uji model 2 tangan akurasi</b>, rata-rata f1-score, precission, dan recall
            bernilai 93,76%, 92,67%, 92,75%, dan 92,77%
          </li>
          <li class="fragment">
            <b>Hasil uji model 1 tangan akurasi</b>, rata-rata f1-score, precission, dan recall
            bernilai 99,49%
          </li>
        </ul>
      </section>
    </section>
    <!-- BAB V -->
    <section>
      <section>
        <h3>BAB 5 Kesimpulan & Saran</h3>
      </section>
      <section>
        <h4>Kesimpulan</h4>
        <ul class="text-2xl">
          <li class="fragment">
            Hasil klasifikasi SVM menghasilkan dua model, model 1 tangan & model 2 tangan
          </li>
          <li class="fragment">
            <b>Hasil uji model 2 tangan akurasi</b>, rata-rata f1-score, precission, dan recall
            bernilai 93,76%, 92,67%, 92,75%, dan 92,77%
          </li>
          <li class="fragment">
            <b>Hasil uji model 1 tangan akurasi</b>, rata-rata f1-score, precission, dan recall
            bernilai 99,49%
          </li>
          <li class="fragment">
            Sistem yang dihasilkan berupa sistem pemeraga alfabet BISINDO yang mengimplementasikan
            model alfabet BISINDO
          </li>
          <li class="fragment">
            Hasil pengujian sistem menggunakan blackbox memperoleh output yang sesuai dengan hasil
            yang diharapkan.
          </li>
        </ul>
      </section>
      <section>
        <h4>Saran</h4>
        <ul class="text-2xl">
          <li class="fragment">Menggunakan metode selain SVM</li>
          <li class="fragment">Memiliki data label "NONE"</li>
        </ul>
      </section>
    </section>
    <section>
      <h4>Daftar Pustaka</h4>
      <ol class="text-xl">
        <li>
          Alexander, N., Widodo, R. B., & Swastika, W. (2023). Penggunaan Machine Learning Dalam
          Klasifikasi Bahasa Isyarat BISINDO Menggunakan Kamera. Prosiding Seminar Nasional
          Informatika & Sistem Informasi, 3(1), 11–26.
        </li>
        <li>
          Alita, D., Fernando, Y., & Sulistiani, H. (2020). Implementasi Algoritma Multiclass Svm
          Pada Opini Publik Berbahasa Indonesia Di Twitter. Jurnal Tekno Kompak, 14(2), 86.
          https://doi.org/10.33365/jtk.v14i2.792
        </li>
        <li>
          Anam, N. (2022). Sistem Deteksi Simbol Pada Sibi (Sistem Isyarat Bahasa Indonesia)
          Menggunakan Mediapipe Dan ResNet-50.
        </li>
        <li>
          Aziz, A. N. (2021). Image Recognition Alfabet Bahasa Isyarat Indonesia (Bisindo)
          Menggunakan Metode Convolutional Neural Network.
          https://dspace.uii.ac.id/handle/123456789/32137%0Ahttps://dspace.uii.ac.id/bitstream/handle/123456789/32137/17523001
          Achmad Noer Aziz.pdf?sequence=1
        </li>
        <li>
          5) Chusna, N. L., Shalahudin, M. I., Riyanto, U., & Alexander, A. D. (2022). Klasifikasi
          Citra Jenis Tanaman Jamur Layak Konsumsi Menggunakan Algoritma Multiclass Support Vector
          Machine. Building of Informatics, Technology and Science (BITS), 4(1), 178–183.
          https://doi.org/10.47065/bits.v4i1.1624
        </li>
      </ol>
    </section>
    <section>
      <section>
        <h3>Lampiran</h3>
      </section>
      <section>
        <h4>Gambar Dataset</h4>
        <div class="r-stack"><img alt="abjad bisindo" src="/abjad-bisindo.png" /></div>
      </section>
    </section>
  </div>
</div>
