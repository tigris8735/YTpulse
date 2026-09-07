import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YT Pulse — Тренды и аналитика YouTube",
  description: "Веб-сервис для авторов YouTube: американские тренды, разбор превью, генерация контента",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-bg text-white antialiased">{children}</body>
    </html>
  );
}
