import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SI AI Hub — Ruang belajar Sistem Informasi",
  description:
    "Ruang belajar AI untuk mahasiswa Sistem Informasi. Mode demo aktif; OpenRouter belum dihubungkan.",
  applicationName: "SI AI Hub",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
