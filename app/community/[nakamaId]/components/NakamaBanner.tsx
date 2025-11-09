import React from 'react';
import { Users, Zap, Calendar, UserPlus, Bell } from 'lucide-react';
import type { NakamaCommunity } from '../types';
import BannerCarousel from '../../components/BannerCarousel';

interface NakamaBannerProps {
  nakama: NakamaCommunity;
  onJoinClick: () => void;
  onLeaveClick: () => void;
  bannerImages: string[];
  activeBannerIndex: number;
  createdAtText: string;
}

const NakamaBanner: React.FC<NakamaBannerProps> = ({ nakama, onJoinClick, onLeaveClick, bannerImages, activeBannerIndex, createdAtText }) => {
  const slides = (bannerImages.length ? bannerImages : [nakama.banner]).map((url, index) => ({
    url,
    title: `${nakama.name} cover ${index + 1}`,
  }));
  const safeActiveIndex = Math.min(activeBannerIndex, slides.length - 1);

  return (
    <div className="relative h-80 overflow-hidden">
      <BannerCarousel banners={slides} activeIndex={safeActiveIndex} />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-end gap-6">
          <img
            src={nakama.avatar}
            alt={nakama.name}
            className="w-24 h-24 rounded-2xl border-4 border-white/20"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{nakama.name}</h1>
            <p className="text-gray-300 text-lg mb-4 max-w-2xl">{nakama.description}</p>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">{nakama.members.toLocaleString()} üye</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">{nakama.activeMembers} aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">{createdAtText}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {nakama.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!nakama.isJoined ? (
              <button
                onClick={onJoinClick}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Katıl
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  className="px-6 py-3 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                  onClick={onLeaveClick}
                >
                  Ayrıl
                </button>
                <button className="px-6 py-3 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bildirimler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NakamaBanner;

