import * as tf from '@tensorflow/tfjs';

export async function loadAndProcessImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function extractFeatures(imageUrl: string): Promise<number[]> {
  // Load the image and preprocess it
  const img = new Image();
  img.src = imageUrl;
  await new Promise((resolve) => (img.onload = resolve));

  // Convert the image to a tensor
  const tensor = tf.browser.fromPixels(img)
    .resizeBilinear([224, 224]) // Resize to standard size
    .toFloat()
    .expandDims();

  // Normalize the image
  const normalized = tensor.div(255.0);

  // Get the average of each channel as a simple feature vector
  const features = await normalized.mean([1, 2]).data();

  // Cleanup
  tensor.dispose();
  normalized.dispose();

  return Array.from(features);
}

export function calculateSimilarity(features1: number[], features2: number[]): number {
  // Calculate cosine similarity
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < features1.length; i++) {
    dotProduct += features1[i] * features2[i];
    norm1 += features1[i] * features1[i];
    norm2 += features2[i] * features2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Sample image database with feature vectors
export const sampleImages: ImageResult[] = [
  {
    url: 'https://images.unsplash.com/photo-1682687220742-aba19b51f36d',
    title: 'Mountain Landscape',
    similarity: 0
  },
  {
    url: 'https://images.unsplash.com/photo-1682687221038-404670f09471',
    title: 'Ocean Sunset',
    similarity: 0
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
    title: 'Urban Architecture',
    similarity: 0
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
    title: 'Forest Path',
    similarity: 0
  }
];