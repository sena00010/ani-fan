'use client';

import React from 'react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

interface BannerOverlayProps {
  subtitle: string;
}

const BannerOverlay: React.FC<BannerOverlayProps> = ({ subtitle }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 animate-title-gradient">AnimeConnect Community</h1>
        <p className="text-2xl text-gray-200 mb-6">{subtitle}</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">2.4K Aktif Üye</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="font-semibold">156 Günlük Post</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">89 Yeni Üye</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerOverlay;

