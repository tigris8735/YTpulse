import axios from 'axios';
import type { YouTubeVideo } from '@/types';

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || '0');
  const m = parseInt(match[2] || '0');
  const s = parseInt(match[3] || '0');
  return h * 3600 + m * 60 + s;
}

export async function fetchTrendingUS(): Promise<YouTubeVideo[]> {
  if (!YT_API_KEY) {
    console.warn('[YT] API key not set, using mock data');
    return getMockTrends();
  }

  try {
    const res = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults: 50,
        key: YT_API_KEY,
      },
      timeout: 10000,
    });

    return res.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      viewCount: item.statistics?.viewCount || '0',
      duration: item.contentDetails?.duration || 'PT0S',
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (err) {
    console.error('[YT] API error:', err);
    return getMockTrends();
  }
}

function getMockTrends(): YouTubeVideo[] {
  return [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up',
      channelTitle: 'Rick Astley',
      viewCount: '1500000000',
      duration: 'PT3M33S',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      publishedAt: '2009-10-25',
    },
    {
      id: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      channelTitle: 'officialpsy',
      viewCount: '5000000000',
      duration: 'PT4M12S',
      thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg',
      publishedAt: '2012-07-15',
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito',
      channelTitle: 'LuisFonsiVEVO',
      viewCount: '8000000000',
      duration: 'PT4M41S',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
      publishedAt: '2017-01-13',
    },
  ];
}

export function applyFilter(videos: YouTubeVideo[], filter: string): YouTubeVideo[] {
  switch (filter) {
    case 'shorts':
      return videos.filter((v) => parseDuration(v.duration) <= 60);
    case 'longform':
      return videos.filter((v) => parseDuration(v.duration) > 60);
    case 'gaming':
      return videos.filter((v) =>
        /gaming|game|play|minecraft|fortnite|gta|call of duty/i.test(v.title)
      );
    case 'ai':
      return videos.filter((v) =>
        /\bai\b|\bgpt\b|\bmodel\b|\bneural\b|\bmachine learning\b|midjourney|stable diffusion/i.test(v.title)
      );
    case 'finance':
      return videos.filter((v) =>
        /\bmoney\b|\binvest\b|\bfinance\b|\bstock\b|\bcrypto\b|\btrading\b|bitcoin|forex/i.test(v.title)
      );
    default:
      return videos;
  }
}

export function formatViews(num: string): string {
  const n = parseInt(num);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return num;
}

export function formatDuration(iso: string): string {
  const sec = parseDuration(iso);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
