import React, { useState, useCallback } from 'react';
import { ImageDropzone } from './components/ImageDropzone';
import { ResultsGrid } from './components/ResultsGrid';
import { Search } from 'lucide-react';
import {
  loadAndProcessImage,
  extractFeatures,
  calculateSimilarity,
  sampleImages
} from './utils/imageProcessing';
import type { ImageResult, ProcessedImage } from './types';

function App() {
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      
      // Load and process the uploaded image
      const dataUrl = await loadAndProcessImage(file);
      const features = await extractFeatures(dataUrl);
      
      setSelectedImage({ features, dataUrl });

      // Process sample images and calculate similarities
      const processedResults = await Promise.all(
        sampleImages.map(async (img) => {
          const imgFeatures = await extractFeatures(img.url);
          const similarity = calculateSimilarity(features, imgFeatures);
          return { ...img, similarity };
        })
      );

      // Sort by similarity
      const sortedResults = processedResults.sort((a, b) => b.similarity - a.similarity);
      setResults(sortedResults);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Search className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Visual Search Engine
          </h1>
        </div>

        <div className="mb-8">
          <ImageDropzone onImageSelect={handleImageSelect} />
        </div>

        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing image...</p>
          </div>
        )}

        {selectedImage && !isProcessing && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Image
            </h2>
            <img
              src={selectedImage.dataUrl}
              alt="Selected"
              className="max-w-md mx-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {results.length > 0 && !isProcessing && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Similar Images
            </h2>
            <ResultsGrid results={results} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;