
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-400"></div>
        <p className="text-lg font-semibold text-gray-300">Analyzing Image...</p>
        <p className="text-sm text-gray-500">The AI is inspecting the leaf.</p>
    </div>
  );
};
