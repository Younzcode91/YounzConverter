# YounzConverter MVP

Monorepo converter file dengan UI Next.js 16 App Router dan REST API Laravel 12. MVP sengaja memakai pipeline simulasi: upload disimpan di disk lokal, disalin sebagai output, dan semua respons menyertakan `simulated: true`. Isi file **belum** diubah oleh engine konversi.

## Arsitektur

- `frontend/`: Next.js, TypeScript, Tailwind CSS 4, UI responsif, tema terang/gelap, drag-and-drop, validasi awal, status pekerjaan, dan fallback demo ketika API mati.
- `backend/`: Laravel REST API, SQLite, validasi MIME/ekstensi/ukuran 25 MB, model `Conversion`, metadata registry, serta `ConverterAdapter` dan `MockConverterAdapter` yang dapat diganti engine nyata.
- File privat disimpan di `backend/storage/app/private/conversions` melalui disk `local`; unduhan hanya melalui endpoint terkontrol.

## Menjalankan di Windows PowerShell

```powershell
cd C:\Daffa\YounzConverter\backend
Copy-Item .env.example .env -ErrorAction SilentlyContinue
php artisan key:generate
New-Item database\database.sqlite -ItemType File -Force
php artisan migrate
php artisan serve

# Terminal kedua
cd C:\Daffa\YounzConverter\frontend
$env:NEXT_PUBLIC_API_URL="http://localhost:8000"
npm install
npm run dev
```

## Menjalankan di bash

```bash
cd backend
cp -n .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve

# Terminal kedua
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8000 npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

Buka `http://localhost:3000`. CORS default mengizinkan `localhost:3000` dan `127.0.0.1:3000`.

## Tes dan build

```powershell
cd backend; php artisan test
cd ..\frontend; npm test; npm run lint; npm run build
```

## Kontrak API

- `GET /api/converters`: daftar kategori, ekstensi input, dan target format.
- `POST /api/conversions`: multipart dengan `file`, `converter`, `target_format`, dan opsional `options[key]`. Mengembalikan HTTP 201 dan objek pekerjaan.
- `GET /api/conversions/{id}`: status dan metadata pekerjaan.
- `GET /api/conversions/{id}/download`: unduh hasil salinan simulasi.

Contoh respons pekerjaan:

```json
{"data":{"id":"uuid","status":"completed","target_format":"jpg","simulated":true,"download_url":"http://localhost:8000/api/conversions/uuid/download"}}
```

Kesalahan validasi memakai HTTP 422 standar Laravel. ID yang tidak ditemukan menghasilkan 404.

## Keamanan MVP

- Validasi server memeriksa ukuran, ekstensi yang cocok dengan kategori, format tujuan, dan MIME allowlist; validasi browser bukan batas keamanan.
- File berada di storage privat dan nama output dibuat server. Pipeline tidak menjalankan shell, macro, atau parser dokumen eksternal.
- Untuk produksi: tambahkan autentikasi/rate limiting, antivirus, content sniffing lebih kuat, kuota, TTL cleanup, randomisasi nama sumber, isolated workers, CSP, logging tanpa data sensitif, dan object storage dengan signed URL.
- Salinan output memakai ekstensi target tetapi byte sumber asli. Label simulasi wajib dipertahankan hingga engine nyata aktif.

## Roadmap engine

1. **ImageMagick**: worker terisolasi untuk gambar/stiker, batas piksel dan memory, strip metadata, serta policy.xml ketat.
2. **LibreOffice**: konversi Word/Excel/PDF secara headless di container tanpa jaringan, timeout, dan profil sementara per job.
3. **rembg**: service Python terpisah untuk hapus latar, model lokal, pembatasan resolusi, dan antrean GPU/CPU.
4. **FFmpeg**: GIF/video dengan protocol allowlist, timeout, batas frame/durasi, dan resource limits.
5. Pindahkan eksekusi ke Laravel queue, tambah progress riil, retry idempoten, cleanup terjadwal, dan integration test per adapter.
