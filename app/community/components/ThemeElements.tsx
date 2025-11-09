import React from 'react';

type ThemeVariant = 'purple' | 'dark' | 'light' | string;

interface ThemeElementsProps {
  theme: ThemeVariant;
}

const ThemeElements: React.FC<ThemeElementsProps> = ({ theme }) => {
  switch (theme) {
    case 'purple':
      return (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌸</div>
          <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🎌</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
        </>
      );
    case 'dark':
      return (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/10 via-gray-700/10 to-gray-800/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌙</div>
          <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🌑</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
        </>
      );
    case 'light':
      return (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-100/20 via-yellow-100/15 to-amber-150/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/25 to-yellow-300/25 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/25 to-amber-400/25 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">☀️</div>
          <div className="absolute top-40 right-20 text-4xl opacity-25 animate-float-reverse">🌟</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-22 animate-float">🌤️</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-30 animate-float-reverse">✨</div>
        </>
      );
    default:
      return null;
  }
};

export default ThemeElements;

