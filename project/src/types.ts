export interface ImageResult {
  url: string;
  similarity: number;
  title: string;
}

export interface ProcessedImage {
  features: number[];
  dataUrl: string;
}