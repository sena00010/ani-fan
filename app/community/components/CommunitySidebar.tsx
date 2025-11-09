'use client';

import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Bookmark, Hash, Star, Users, Video } from 'lucide-react';
import type { ThemeMode } from '@/contexts/ThemeContext';
import type { CommunityTab, PopularItem, ThemeColors } from '../types';

interface CommunitySidebarProps {
  theme: ThemeMode;
  colors: ThemeColors;
  activeTab: CommunityTab;
  setActiveTab: Dispatch<SetStateAction<CommunityTab>>;
  popularAnime: PopularItem[];
}

const trendingTags = [
  '#OnePiece',
  '#AttackOnTitan',
  '#DemonSlayer',
  '#JujutsuKaisen',
  '#MyHeroAcademia',
  '#Naruto'
];

const CommunitySidebar: React.FC<CommunitySidebarProps> = ({
  theme,
  colors,
  activeTab,
  setActiveTab,
  popularAnime
}) => {
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className={`${colors.surface} backdrop-blur-md rounded-3xl p-6 border ${colors.border}`}>
        <h3 className={`${colors.text} font-bold text-xl mb-6`}>Kategoriler</h3>
        <div className="space-y-3">
          {[
            { id: 'all', label: 'All Posts', icon: Hash },
            { id: 'anime', label: 'Anime', icon: Video },
            { id: 'manga', label: 'Manga', icon: Bookmark },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'nakama', label: 'Nakama', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as CommunityTab)}
              className={`w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                activeTab === id
                  ? theme === 'light'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : `${colors.textSecondary} ${colors.hover}`
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`${colors.surface} backdrop-blur-md rounded-3xl p-6 border ${colors.border} shadow-xl mt-6`}>
        <h3 className={`${colors.text} font-bold text-xl mb-6`}>Popüler Bu Hafta</h3>

        <div className="space-y-4">
          {popularAnime.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group ${
                theme === 'light' ? 'hover:bg-amber-50/60' : 'hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                />
                <div
                  className={`absolute -top-2 -right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                >
                  #{index + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`${colors.text} font-semibold text-sm mb-1 truncate`}>{item.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(item.score) ? 'text-yellow-400 fill-current' : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`${colors.textSecondary} text-xs`}>{item.score}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className={`px-2 py-1 text-xs rounded-full border ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 border-amber-400/30'
                          : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30'
                      }`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${colors.textSecondary} text-xs`}>
                    {item.views.toLocaleString()} görüntüleme
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Ongoing'
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`w-full mt-6 py-3 rounded-2xl ${
            theme === 'light'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold hover:from-amber-600 hover:to-yellow-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600'
          } transition-all duration-300 shadow-lg hover:shadow-xl`}
        >
          Daha Fazla Gör
        </button>

        <div className="mt-8">
          <h4 className={`${colors.text} font-semibold text-lg mb-4`}>Trend Etiketler</h4>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 text-sm rounded-full border transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 border-amber-400/30 hover:from-amber-500/30 hover:to-yellow-500/30'
                    : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;

