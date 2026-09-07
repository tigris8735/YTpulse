export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: string;
  duration: string;
  thumbnail: string;
  publishedAt: string;
  viewCountFormatted?: string;
  durationFormatted?: string;
  scoreSum?: number;
  tags?: PreviewTags | null;
}

export interface PreviewTags {
  videoId: string;
  faceCloseup: boolean;
  highContrast: boolean;
  textArea: boolean;
  centerObject: boolean;
  scoreSum: number;
}

export interface User {
  id: string;
  email: string;
  plan: string;
  proExpiresAt: Date | null;
  proActive: boolean;
  createdAt: Date;
}

export interface GenerationJob {
  id: string;
  type: 'thumb' | 'video';
  status: 'queued' | 'rendering' | 'ready' | 'error';
  fileUrl: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRecord {
  id: string;
  yookassaId: string;
  term: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface ThumbnailVariant {
  id: number;
  text: string;
  imageUrl: string;
}
