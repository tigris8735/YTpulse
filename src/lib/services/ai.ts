import axios from 'axios';
import type { ThumbnailVariant } from '@/types';

const GROQ_KEY = process.env.GROQ_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

export async function generateThumbnailText(trendTitle: string): Promise<string[]> {
  const prompt = `Generate 3 catchy YouTube thumbnail title variations (max 6 words each) for a video about: "${trendTitle}". Return ONLY a JSON array of 3 strings.`;

  if (GROQ_KEY) {
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 200,
        },
        { headers: { Authorization: `Bearer ${GROQ_KEY}` }, timeout: 15000 }
      );
      const content = res.data.choices[0].message.content;
      const match = content.match(/\[[\s\S]*?\]/); 
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      console.warn('[AI] Groq failed, trying Gemini');
    }
  }

  if (GEMINI_KEY) {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { timeout: 15000 }
      );
      const content = res.data.candidates[0].content.parts[0].text;
      const match = content.match(/\[[\s\S]*?\]/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      console.warn('[AI] Gemini failed');
    }
  }

  return [
    `${trendTitle} — Shocking Truth`,
    `I Tried ${trendTitle} — Results`,
    `${trendTitle} Explained in 60s`,
  ];
}

export function generateThumbnailImageUrl(text: string, seed: number): string {
  const encoded = encodeURIComponent(text);
  return `https://image.pollinations.ai/prompt/${encoded}%20youtube%20thumbnail%20eye-catching%20high%20contrast?width=1280&height=720&seed=${seed}&nologo=true`;
}

export function buildVariants(texts: string[]): ThumbnailVariant[] {
  return texts.slice(0, 3).map((text, i) => ({
    id: i + 1,
    text,
    imageUrl: generateThumbnailImageUrl(text, Date.now() + i),
  }));
}
