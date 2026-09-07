export const siteConfig = {
  name: 'YT Pulse',
  description: 'Веб-сервис для авторов YouTube: американские тренды, разбор превью, генерация контента',
  url: 'https://yt-pulse.vercel.app',
};

export const filters = [
  { id: 'all', label: 'All' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'longform', label: 'Longform' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'ai', label: 'AI' },
  { id: 'finance', label: 'Finance' },
] as const;

export const tagDescriptions: Record<string, { label: string; desc: string }> = {
  faceCloseup: { label: 'Face closeup', desc: 'Лицо занимает заметную часть кадра' },
  highContrast: { label: 'High contrast', desc: 'Сильный контраст яркости' },
  textArea: { label: 'Text area', desc: 'Крупный контрастный блок под текст' },
};

export const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '0 ₽',
    period: 'Бессрочно',
    features: ['Лента трендов US', '6 фильтров', 'Локальный разбор превью', 'Why it clicks (3 тега)'],
    accent: false,
  },
  {
    id: 'pro-1m',
    name: 'Pro',
    price: '700 ₽',
    period: '1 месяц',
    features: ['Всё из Free', 'Генерация превью (AI)', 'Очередь ролика', '3 варианта превью'],
    accent: true,
  },
  {
    id: 'pro-1y',
    name: 'Pro',
    price: '7000 ₽',
    period: '1 год',
    features: ['Всё из Pro месяц', 'Выгода 17%', 'Тот же функционал', 'Другая дата окончания'],
    accent: false,
  },
] as const;
