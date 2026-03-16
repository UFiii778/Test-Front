import React from 'react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="text-4xl font-bold text-red-600 mb-6">🩸 DarahKita</div>
    <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4" />
    <p className="text-gray-400 text-sm">Memuat...</p>
  </div>
);

export default LoadingScreen;
