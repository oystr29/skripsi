# Skripsi

## Python Things (Backend & Model)

Pertama buat **virtual environment** di root project

```bash
python -m venv .venv
```

Aktifkan virtual environment. Format file tergantung kalian ada di shell mana.

```bash
. .venv/bin/activate(.fish|.csh|.ps1|)
```

Pastikan Python mu versi 3.11.x

### Backend

Masuk ke folder `backend` lalu install depedencies
```bash
cd backend/
pip install -r requirements.txt
```

Jika sudah jalankan `flask`

```bash
flask --debug --app app.py run
```

### Model

Masuk ke folder `model`.

```bash
cd model
```

Pastiin kalian punya dataset di dalam folder `image_dataset`. Liat aja struktur folder di bawah.

```bash
├── 📁model
│   ├── 📁image_dataset
│   │   ├── 📁train
│   │   │   ├── 📁A
│   │   │   │   ├── 📃(gambar)
│   │   │   │   ├── 📃(gambar)
│   │   │   ├── 📁B
│   │   │   │   ├── 📃(gambar)
│   │   │   │   ├── 📃(gambar)
│   │   │   ├── 📁.....
│   │   ├── 📁val
│   │   │   ├── 📁A
│   │   │   │   ├── 📃(gambar)
│   │   │   │   ├── 📃(gambar)
│   │   │   ├── 📁B
│   │   │   │   ├── 📃(gambar)
│   │   │   │   ├── 📃(gambar)
│   │   │   ├── 📁.....
```

Jika punya, jalankan file `dataset_conversion.py`. Program ini akan convert gambar kalian jadi .txt yang berisi koordinat.

```bash
python dataset_conversion.py
```

Jika sudah, akan tergenerate folder `dataset_text`.

```bash
├── 📁model
│   ├── 📁dataset_text
│   │   ├── 📁train
│   │   │   ├── 📁A
│   │   │   │   ├── 📃(.txt)
│   │   │   │   ├── 📃(.txt)
│   │   │   ├── 📁B
│   │   │   │   ├── 📃(.txt)
│   │   │   │   ├── 📃(.txt)
│   │   │   ├── 📁.....
│   │   ├── 📁val
│   │   │   ├── 📁A
│   │   │   │   ├── 📃(.txt)
│   │   │   │   ├── 📃(.txt)
│   │   │   ├── 📁B
│   │   │   │   ├── 📃(.txt)
│   │   │   │   ├── 📃(.txt)
│   │   │   ├── 📁.....
```

Setelah itu, jalankan file `fingerspelling_model_creation.py <jumlah>` untuk membuat model dan evaluasi.

```bash
python fingerspelling_model_creation 1 // untuk satu tangan
python fingerspelling_model_creation 2 // untuk dua tangan
```

Outpunya bakal kayak dibawah ini

```bash
├── 📁model
│   ├── 📃model_evaluation_report_1.txt
│   ├── 📃model_evaluation_report_2.txt
│   ├── 📃bisindo_fingerspelling_model_1.pkl
│   ├── 📃bisindo_fingerspelling_model_2.pkl
```

Setelah ini kalian bisa memilih mau menjalankan file `fingerspelling.py` atau `fingerspelling-image.py`

## Frontend

Masuk ke folder `frontend`. Lalu copy `.env.example`

```bash
cd frontend
cp .env.example .env
```

Install depedencies lalu jalankan

```bash
pnpm i
pnpm dev
```

Udah deh 😉

