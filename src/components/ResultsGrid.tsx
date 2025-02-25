import React from 'react';
import type { ImageResult } from '../types';

interface ResultsGridProps {
  results: ImageResult[];
}

export function ResultsGrid({ results }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
        >
          <img
            src={result.url}
            alt={result.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium text-gray-900">{result.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Similarity: {(result.similarity * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}