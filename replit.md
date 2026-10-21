# SI AI Hub

Aplikasi chat belajar untuk kelas Sistem Informasi. Tahap awal memakai respons demo; OpenRouter belum dihubungkan.

## Run & Operate

- `pnpm --filter @workspace/si-ai-hub run dev` — jalankan aplikasi Next.js lokal.
- `npm run build` — typecheck workspace dan build seluruh paket.
- Mode demo tidak memerlukan environment variable.
- `OPENROUTER_API_KEY` baru diperlukan saat OpenRouter diaktifkan; gunakan hanya di server dan jangan memakai prefix `NEXT_PUBLIC_`.

## Stack

- pnpm workspace, Node.js 20.9+, Next.js App Router, TypeScript, Tailwind CSS 4.
- Route Handler demo ada di `artifacts/si-ai-hub/app/ai/chat/route.ts`; request AI tidak memakai Express.
- Katalog model ada di `artifacts/si-ai-hub/src/config/models.ts`; harga tetap `unknown` sampai diverifikasi.
- Riwayat percakapan disimpan di localStorage; belum ada autentikasi atau database untuk SI AI Hub.
- API Server dan canvas yang ada di workspace adalah artifact terpisah.

## Important behavior

- Endpoint chat memakai `/ai/chat`, bukan `/api/chat`, karena artifact API Server workspace sudah memiliki prefix `/api`.
- Teks respons dan banner harus tetap menjelaskan bahwa balasan adalah demo sampai OpenRouter benar-benar diaktifkan.
- Build Next menghasilkan `.next/`, yang sudah diabaikan Git dan Replit.
- Root build memberi `PORT` dan `BASE_PATH` untuk artifact mockup Vite yang juga dibangun oleh workspace.

## Product

- Dashboard/chat responsif dengan riwayat lokal, pemilih model, kartu metadata harga, dan respons demo.
- Semua interaksi AI saat ini hanya demonstrasi; tidak ada API key di browser.
