import sharp from 'sharp';
import axios from 'axios';
import type { PreviewTags } from '@/types';

export async function downloadThumbnail(videoId: string): Promise<Buffer | null> {
  const urls = [
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 });
      if (res.status === 200) return Buffer.from(res.data);
    } catch {
      continue;
    }
  }
  return null;
}

export async function analyzePreview(videoId: string): Promise<PreviewTags> {
  const buffer = await downloadThumbnail(videoId);
  if (!buffer) {
    return { videoId, faceCloseup: false, highContrast: false, textArea: false, centerObject: false, scoreSum: 0 };
  }

  const image = sharp(buffer);
  const { width = 480, height = 360 } = await image.metadata();
  const raw = await image.raw().toBuffer({ resolveWithObject: true });
  const pixels = raw.data;
  const totalPixels = width * height;

  // 1. High Contrast
  let sum = 0, sumSq = 0;
  for (let i = 0; i < pixels.length; i += 3) {
    const gray = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
    sum += gray;
    sumSq += gray * gray;
  }
  const mean = sum / totalPixels;
  const stdDev = Math.sqrt(sumSq / totalPixels - mean * mean);
  const highContrast = stdDev >= 55;

  // 2. Text Area (bottom 30% high contrast)
  const rowSize = width * 3;
  let textSum = 0, textSumSq = 0, textCount = 0;
  const startY = Math.floor(height * 0.7);
  for (let y = startY; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + x * 3;
      const gray = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
      textSum += gray;
      textSumSq += gray * gray;
      textCount++;
    }
  }
  const textStd = Math.sqrt(textSumSq / textCount - (textSum / textCount) ** 2);
  const textArea = textStd > 40;

  // 3. Center Object
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const centerRadius = Math.min(width, height) * 0.15;
  let centerSum = 0, centerCount = 0;
  let edgeSum = 0, edgeCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + x * 3;
      const gray = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < centerRadius) { centerSum += gray; centerCount++; }
      else if (x < width * 0.1 || x > width * 0.9 || y < height * 0.1 || y > height * 0.9) {
        edgeSum += gray; edgeCount++;
      }
    }
  }
  const centerObject = Math.abs(centerSum / centerCount - edgeSum / edgeCount) > 15;

  // 4. Face Closeup (skin-tone heuristic)
  let facePixels = 0;
  for (let y = Math.floor(height * 0.1); y < Math.floor(height * 0.6); y++) {
    for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.8); x++) {
      const idx = y * rowSize + x * 3;
      const [r, g, b] = [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
      if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 10 && Math.abs(r - b) > 10) {
        facePixels++;
      }
    }
  }
  const faceCloseup = facePixels / totalPixels >= 0.08;

  const scoreSum = (faceCloseup ? 1 : 0) + (highContrast ? 1 : 0) + (textArea ? 1 : 0) + (centerObject ? 1 : 0);

  return { videoId, faceCloseup, highContrast, textArea, centerObject, scoreSum };
}
