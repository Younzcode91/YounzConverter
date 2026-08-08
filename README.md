# YounzConverter

> Aplikasi konversi file modern dengan frontend **Next.js** dan REST API **Laravel**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/status-MVP-f59e0b)](#status-mvp)

**Demo frontend:** https://frontend-coral-mu-w0iagi6jy2.vercel.app

**Repository:** https://github.com/Younzcode91/YounzConverter

## Tentang proyek

YounzConverter adalah monorepo untuk aplikasi converter serbaguna dengan antarmuka responsif berbahasa Indonesia. Pengguna dapat memilih alat, mengunggah file melalui drag-and-drop, menentukan format hasil, melihat status pekerjaan, dan mengunduh hasil melalui endpoint terkontrol.

Proyek saat ini merupakan **MVP dengan pipeline simulasi**. Backend menerima dan memvalidasi upload, menyimpan file secara privat, membuat catatan pekerjaan, lalu menyalin file sebagai output. Isi file belum benar-benar dikonversi dan setiap respons terkait diberi penanda `simulated: true`.

## Fitur

- Converter gambar: JPG, JPEG, PNG, WEBP, dan GIF
- Alur PDF, Word, dan Excel
- Antarmuka hapus latar belakang
- Alur pembuatan sticker dan GIF
- Drag-and-drop upload dengan validasi awal
- Pilihan format output dan pengaturan kualitas
- Riwayat serta status pekerjaan
- Tema terang dan gelap
- Tampilan responsif untuk desktop dan perangkat mobile
- REST API dengan validasi MIME, ekstensi, kategori, target, dan ukuran
- Penyimpanan file privat dan endpoint download terkontrol
- Fallback demo transparan ketika backend tidak tersedia
- Arsitektur adapter yang siap diganti dengan engine konversi nyata

## Status MVP

| Komponen | Status |
|---|---|
| UI Next.js | Aktif dan tersedia di Vercel |
| Laravel REST API | Berfungsi untuk development lokal |
| Upload, validasi, job, dan download | Berfungsi |
| Konversi file nyata | Belum aktif — masih simulasi |
| Backend publik | Belum dideploy |

> Demo Vercel hanya menjalankan frontend. Karena backend Laravel belum online, aksi konversi pada demo akan menggunakan fallback simulasi dan tidak mengubah isi file.

## Teknologi

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- ESLint

### Backend

- Laravel 12
- PHP 8.2+
- SQLite untuk development
- Laravel Storage
- PHPUnit

## Struktur proyek

```text
YounzConverter/
├── frontend/                   # Next.js App Router
│   ├── src/app/                # Layout, halaman, dan styling
│   ├── src/components/         # Workspace converter
│   └── src/lib/                # Tipe, validasi, dan utilitas
├── backend/                    # Laravel REST API
│   ├── app/                    # Controller, model, dan adapter
│   ├── routes/api.php          # Endpoint API
│   ├── database/               # Migration dan SQLite lokal
│   └── tests/                  # Unit dan feature tests
└── README.md
```

## Persyaratan

- Node.js 20 atau lebih baru
- npm
- PHP 8.2 atau lebih baru
- Composer
- Ekstensi PHP yang dibutuhkan Laravel

## Menjalankan secara lokal

### 1. Clone repository

```bash
git clone https://github.com/Younzcode91/YounzConverter.git
cd YounzConverter
```

### 2. Siapkan backend Laravel

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Buat database SQLite:

```bash
# Bash / Git Bash
mkdir -p database
touch database/database.sqlite

# PowerShell, gunakan perintah berikut sebagai pengganti touch:
# New-Item database/database.sqlite -ItemType File -Force
```

Jalankan migrasi dan server:

```bash
php artisan migrate
php artisan serve
```

Backend tersedia secara default di `http://127.0.0.1:8000`.

### 3. Siapkan frontend Next.js

Buka terminal kedua:

```bash
cd frontend
npm install
```

Buat file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Jalankan frontend:

```bash
npm run dev
```

Buka `http://localhost:3000`.

> Jika port `3000` telah digunakan aplikasi lain, jalankan `npm run dev -- --port 3201`, lalu izinkan origin tersebut di konfigurasi CORS Laravel untuk development.

## Pengujian dan build

### Frontend

```bash
cd frontend
npm test -- --run
npm run lint
npm run build
```

### Backend

```bash
cd backend
php artisan test
```

Status verifikasi terakhir:

- Frontend: **4 tests passed**
- Backend: **5 tests passed, 18 assertions**
- ESLint: **passed**
- Next.js production build: **passed**

## Kontrak API

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/converters` | Daftar kategori, input, dan target format |
| `POST` | `/api/conversions` | Upload file dan membuat pekerjaan konversi |
| `GET` | `/api/conversions/{id}` | Membaca status dan metadata pekerjaan |
| `GET` | `/api/conversions/{id}/download` | Mengunduh hasil pekerjaan |

### Membuat pekerjaan

Kirim `multipart/form-data` ke `POST /api/conversions`:

| Field | Wajib | Keterangan |
|---|---:|---|
| `file` | Ya | File sumber, maksimal 25 MB |
| `converter` | Ya | ID converter, misalnya `image` atau `pdf` |
| `target_format` | Ya | Format hasil yang didukung converter |
| `options[key]` | Tidak | Opsi tambahan, misalnya kualitas |

Contoh respons HTTP `201`:

```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "target_format": "jpg",
    "simulated": true,
    "download_url": "http://127.0.0.1:8000/api/conversions/uuid/download"
  }
}
```

Kesalahan validasi menggunakan HTTP `422`; ID yang tidak ditemukan menghasilkan HTTP `404`.

## Keamanan MVP

- Validasi server memeriksa ukuran, ekstensi, kategori, format tujuan, dan MIME allowlist.
- File disimpan di storage privat dan hanya diunduh melalui endpoint aplikasi.
- Nama output dibuat oleh server.
- Pipeline MVP tidak menjalankan shell, macro, atau parser dokumen eksternal.
- `.env`, database lokal, dependency, hasil build, dan file upload dikecualikan dari Git.
- Ekstensi target pada output simulasi tidak berarti byte file telah berubah.

Sebelum penggunaan produksi, tambahkan autentikasi, rate limiting, antivirus, content sniffing yang lebih kuat, kuota, TTL cleanup, isolated workers, object storage, signed URL, audit log, dan pembatasan resource.

## Roadmap

1. **ImageMagick** untuk gambar dan sticker, dengan batas piksel/memori dan metadata stripping.
2. **LibreOffice headless** untuk Word, Excel, dan PDF dalam worker terisolasi.
3. **rembg** sebagai service Python terpisah untuk menghapus latar belakang.
4. **FFmpeg** untuk GIF/video dengan batas durasi, frame, protocol, dan timeout.
5. Laravel Queue untuk progress nyata, retry idempoten, dan cleanup terjadwal.
6. Object storage dan database production.
7. Deployment backend publik dan integrasi dengan frontend Vercel.
8. Integration test untuk setiap adapter konversi nyata.

## Deployment

Frontend telah dideploy ke Vercel:

https://frontend-coral-mu-w0iagi6jy2.vercel.app

Untuk deployment penuh, backend Laravel perlu ditempatkan pada layanan yang mendukung PHP, database, persistent storage, dan worker—misalnya VPS, Railway, atau Render. Setelah backend online, atur environment variable Vercel:

```env
NEXT_PUBLIC_API_URL=https://alamat-backend.example.com
```

Kemudian lakukan redeploy frontend.

## Kontribusi

Issue dan pull request dipersilakan. Untuk perubahan perilaku, tambahkan atau perbarui test dan pastikan seluruh perintah test, lint, serta build lulus sebelum mengirim pull request.

## Pengelola

Dibuat oleh [Younzcode91](https://github.com/Younzcode91).
