# 🎬 YT Pulse

**SaaS-прототип для авторов YouTube** — американские тренды, разбор превью, генерация контента.

## ⚡ Быстрый старт

```bash
# 1. Распакуйте архив
cd yt-pulse

# 2. Установите зависимости
npm install

# 3. Скопируйте и заполните .env
cp .env.example .env
# Отредактируйте .env — вставьте свои ключи

# 4. Инициализируйте БД
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# 5. Запустите
npm run dev
# Откройте http://localhost:3000
```

## 🔑 Необходимые API-ключи

| Переменная | Где получить |
|------------|--------------|
| `DATABASE_URL` | [neon.tech](https://neon.tech) — Connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) → YouTube Data API v3 |
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) |
| `GEMINI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `YOOKASSA_SHOP_ID` | [yookassa.ru/developers](https://yookassa.ru/developers/) — тестовый кабинет |
| `YOOKASSA_SECRET_KEY` | Там же |

## 🏗 Структура проекта

```
yt-pulse/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Вход / Регистрация
│   │   ├── (dashboard)/        # Кабинет (тренды, превью, генерация, очередь)
│   │   ├── api/                # API Routes (13 эндпоинтов)
│   │   └── payments/           # Экраны оплаты
│   ├── components/
│   │   ├── layout/             # Sidebar, TopBar, BottomBar
│   │   ├── ui/                 # VideoCard, FilterChips, ProLock, Button
│   │   └── features/           # TrendRail, PreviewList, PreviewTags
│   ├── hooks/                  # useAuth, useUser, useTrends
│   ├── lib/
│   │   ├── db/                 # Prisma client
│   │   ├── auth/               # JWT, bcrypt, isPro
│   │   ├── services/           # YouTube, Analyzer, AI, Payment
│   │   └── utils/              # helpers (cn)
│   ├── types/                  # TypeScript interfaces
│   └── config/                 # site.ts (filters, plans, tags)
├── prisma/                     # Схема БД + seed
├── analyzer/                   # Python FastAPI (опционально)
├── public/                     # Статика
└── [конфиги]                   # next.config, tailwind, middleware
```

## 🚀 Деплой на Vercel

1. Запушьте на GitHub
2. Импортируйте на [vercel.com](https://vercel.com)
3. Добавьте переменные окружения из `.env.example`
4. Деплой автоматический из `main`

**Важно:** API-ключи только в Vercel Environment Variables, **не в репозитории**.

## ✅ Реализовано по ТЗ

- [x] Авторизация (регистрация/вход, JWT, middleware)
- [x] Лента трендов US (YouTube API, 6 фильтров, кэш Neon)
- [x] Разбор превью (Sharp fallback + опциональный Python MediaPipe/OpenCV)
- [x] 3 тега Why it clicks + score_sum 0-4
- [x] Генерация превью (Groq/Gemini + Pollinations, 3 варианта)
- [x] Замок для Free + Pro проверка
- [x] Очередь ролика (статусы queued→rendering→ready, заглушка)
- [x] Личный кабинет (4 вкладки)
- [x] Тарифы Free/Pro + ЮKassa Test
- [x] UI по макетам ТЗ (тёмная тема, сайдбар 228px, рельс 320px, нижний бар 72px)

---

*Проект подготовлен в соответствии с ТЗ YT Pulse v1.0*
