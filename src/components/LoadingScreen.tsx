import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-indigo-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Gramavana</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading your vegetarian experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;