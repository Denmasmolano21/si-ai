# SI AI Hub

Ruang chat dan belajar untuk kelas Sistem Informasi. Versi awal memakai
respons demo yang jelas diberi label; belum ada permintaan yang dikirim ke
OpenRouter. Route Handler Next.js menerima pesan di `/ai/chat`.

## Menjalankan secara lokal

Gunakan Node.js 20.9 atau lebih baru dan pnpm:

```bash
pnpm install
pnpm --filter @workspace/si-ai-hub run dev
```

Buka alamat lokal yang ditampilkan Next.js. Untuk build produksi:

```bash
pnpm --filter @workspace/si-ai-hub run build
```

`npm run build` juga dapat dijalankan dari folder `artifacts/si-ai-hub`.
Perintah `npm run build` di root workspace menjalankan typecheck dan build
seluruh paket workspace.

## Environment variables

| Variable | Wajib sekarang? | Keterangan |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Tidak | Belum digunakan di mode demo. Simpan hanya sebagai server-side secret saat integrasi OpenRouter ditambahkan. |
| `PORT` | Tidak untuk lokal | Port server; workflow Replit mengaturnya otomatis. |
| `BASE_PATH` | Tidak | Disediakan oleh workflow Replit; aplikasi ini memakai root path. |

Tidak ada API key yang dibutuhkan atau dibaca oleh UI demo.

## Model dan harga

Katalog saat ini hanya contoh konfigurasi UI. ID/nama model belum diverifikasi
terhadap katalog OpenRouter, dan harga ditampilkan sebagai “belum
diverifikasi”. Perbarui `src/config/models.ts` dengan model serta status harga
yang benar sebelum mengaktifkan permintaan AI.

## Deploy ke Vercel

Hubungkan repository ke Vercel dan pilih folder `artifacts/si-ai-hub` sebagai
Root Directory. Gunakan Next.js build standar. Tidak ada environment variable
yang diperlukan untuk mode demo. Tambahkan `OPENROUTER_API_KEY` hanya setelah
Route Handler diaktifkan untuk memanggil OpenRouter dari server.

## Keamanan

Jangan menambahkan API key ke kode browser atau variabel berawalan `NEXT_PUBLIC_`.
Route Handler Next.js menjadi satu-satunya tempat untuk integrasi provider.
