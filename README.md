# 🎬 YT Pulse - SaaS для авторов YouTube

![Next.js](https://img.shields.io/badge/Next.js-Frontend-black.svg)
![Vercel](https://img.shields.io/badge/Vercel-Hosting-black.svg)
![Neon](https://img.shields.io/badge/Neon-PostgreSQL-blue.svg)
![YouTube](https://img.shields.io/badge/YouTube_Data_API-v3-red.svg)

**Веб-сервис для анализа американских трендов YouTube, разбора кликабельности превью и генерации контента**

## 📋 О проекте

YT Pulse — это прототип SaaS-платформы для авторов YouTube, который помогает:
- 📈 Мониторить американские тренды (US `mostPopular`) с 6 фильтрами
- 🔍 Анализировать кликабельность чужих превью через локальные алгоритмы (MediaPipe + OpenCV)
- 🎨 Генерировать паки превью на основе трендов (только Pro)
- 🎬 Создавать задачи на генерацию роликов (только Pro)

Проект реализован как прототип: хостинг Vercel Hobby, база Neon free, оплата через ЮKassa Test (без реальных списаний).

## 🚀 Основные возможности

- 📈 **Лента трендов США** — актуальные ролики из `mostPopular` (регион US)
- 🔍 **Why it clicks** — локальный разбор превью: лицо, контраст, текстовая зона
- 🎨 **Генерация превью** — AI-текст (Groq/Gemini) + AI-изображение (Pollinations/Gemini Flash), 3 варианта
- 🎬 **Очередь ролика** — создание задач на генерацию видео со статусами
- 💳 **Тарифы Free / Pro** — тестовая оплата через ЮKassa, автопродления нет
- 🏠 **Личный кабинет** — профиль, подписка, возможности, история платежей

## 🏗 Архитектура

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │◄──►│   Vercel         │◄──►│   YouTube Data  │
│   Web Client    │    │   Serverless API │    │   API v3        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
           ┌────────────────────┼────────────────────┐
           ▼                    ▼                    ▼
    ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
    │   Neon      │    │   Groq /     │    │   Pollinations  │
    │   PostgreSQL│    │   Gemini     │    │   / Gemini Flash│
    └─────────────┘    └──────────────┘    └─────────────────┘
           │
    ┌─────────────┐
    │ OpenCV +    │
    │ MediaPipe   │
    └─────────────┘
```

## ⚡ Быстрый старт

```bash
# Клонирование репозитория
git clone https://github.com/yourusername/yt-pulse.git
cd yt-pulse

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Заполните: DATABASE_URL (Neon), YOUTUBE_API_KEY, GROQ_API_KEY, etc.

# Генерация Prisma клиента
npx prisma generate

# Запуск dev-сервера
npm run dev
```

## 📖 Документация

Полная документация проекта доступна в папке [docs/](./documentation/):

- [Бизнес-требования](./documentation/br01.md)
- [Системный анализ](./documentation/sa02.md)
- [План архитектуры](./documentation/ap03.md)
- [Техническое задание](./documentation/tt04.md)
- [План тестирования](./documentation/tp05.md)

## 🛠 Технологический стек

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes (Vercel Serverless)
- **Database**: Neon.tech PostgreSQL (Prisma ORM)
- **AI Текст**: Groq API, Google Gemini API
- **AI Изображения**: Pollinations API, Gemini Flash Image
- **Анализ превью**: MediaPipe Face Detection, OpenCV
- **Платежи**: ЮKassa Test
- **Видео** (опционально): FFmpeg, Luma Ray API, fal.ai

## 👥 Команда разработки

| Роль | Разработчик | юзернейм GitHab |
|------|-------------|---------------|
| Team Lead & Backend | Чернаков Денис | tigris8735 |
| Frontend Developer | Бобин Вадим | MadCat-Lon |
| AI/ML Engineer | Татаринов Вячеслав | shinsetsuwhy |

---

*Документация подготовлена для проекта YT Pulse*

---
