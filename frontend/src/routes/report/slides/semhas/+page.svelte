<script>
  import { onMount } from 'svelte';

  import Reveal from 'reveal.js';
  import Highlight from 'reveal.js/plugin/highlight/highlight';
  import Markdown from 'reveal.js/plugin/markdown/markdown';
  import Notes from 'reveal.js/plugin/notes/notes';
  import Search from 'reveal.js/plugin/search/search';
  import Math from 'reveal.js/plugin/math/math';
  import Zoom from 'reveal.js/plugin/zoom/zoom';

  import 'reveal.js/dist/reveal.css';
  import 'reveal.js/dist/theme/dracula.css';
  import 'reveal.js/plugin/highlight/monokai.css';

  onMount(() => {
    Reveal.initialize({
      plugins: [Markdown, Highlight, Notes, Search, Math, Zoom],
      autoAnimateEasing: 'ease',
      autoAnimateDuration: 1,
      hash: true,
      parallaxBackgroundImage: '/parallax-bg4.webp',
      parallaxBackgroundSize: '2100px 900px',
      parallaxBackgroundHorizontal: 200
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
          <span class="text-yellow-500">Bu Masna</span>,
          <span class="text-green-500">Bu Ummul</span>,
          <span class="text-blue-500">Bu Novi</span>
        </h4>
        <div class="flex gap-10 flex-wrap">
          <div>
            <p>BAB I</p>
            <ul>
              <li class="fragment text-yellow-500">
                Tidak perlu sebutkan detail sistem di latar belakang
              </li>
              <li class="fragment text-green-500">Terlalu banyak sehingga</li>
              <li class="fragment text-green-500">
                Tulisakan kendala, masalah kenapa ini mau dibuat
              </li>
              <li class="fragment text-blue-500">Batasan masalah masih kurang</li>
              <li class="fragment text-blue-500">
                Langsung tulis bagi lembaga siapa di Manfaat Penelitian
              </li>
            </ul>
          </div>
          <div>
            <p>BAB II</p>
            <ul>
              <li class="fragment text-green-500">Jelaskann lebih soal <i>landmark</i></li>
              <li class="fragment text-blue-500">Bagian BISINDO jangan cuman 1 paragraf</li>
              <li class="fragment text-blue-500">Tambahakan flowchart SVM</li>
            </ul>
          </div>
          <div>
            <p>BAB III</p>
            <ul>
              <li class="fragment text-red-500">Konsisten data apa (ex: data BISINDO)</li>
              <li class="fragment text-yellow-500">Tambahkan pengujian sistem</li>
              <li class="fragment text-green-500">Sebuatkan jumlah data</li>
              <li class="fragment text-green-500">
                Tulisakan kendala, masalah kenapa ini mau dibuat
              </li>
              <li class="fragment text-blue-500">Buat diagram sistem</li>
            </ul>
          </div>
          <div>
            <p>BAB IV (konsul)</p>
            <ul>
              <li class="fragment text-red-500">Paragraf jangan 1 kalimat</li>
              <li class="fragment text-red-500">Source Code jangan gambar</li>
              <li class="fragment text-yellow-500">Sebut data tabel input dari bab 3</li>
              <li class="fragment text-yellow-500">
                Tabel jangan kepotong sedikit di halaman lanjut
              </li>
            </ul>
          </div>
          <div>
            <p>BAB V (konsul)</p>
            <ul>
              <li class="fragment text-yellow-500">
                Kesimpulan pisah jadi poin svm, uji model, sistem, uji sistem
              </li>
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
    <section>heheh</section>
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
            <code class="text-xs h-full" data-line-numbers="17-20|23-24|27-29">
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
        <h5>Pembuatan Model</h5>
        <ul>
          <li class="fragment">
            Model klasifikasi menggunakan SVM fungsi kernel <i>polynomial</i>
          </li>
          <li>Hasil klasifikasi disimpan pada file .pkl</li>
        </ul>
      </section>
      <section>
        <h5>Pembuatan Sistem bagian <i>back-end</i></h5>
        <ul>
          <li><i>Back-end</i></li>
        </ul>
      </section>
    </section>
  </div>
</div>
