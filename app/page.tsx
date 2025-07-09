"use client"
import React from 'react';

const AnimeHomePage = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex flex-col overflow-x-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Sakura Petals - Çok Daha Fazla */}
          <div className="absolute top-10 left-10 text-pink-300 opacity-60 animate-float">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute top-16 left-32 text-pink-400 opacity-40 animate-float-reverse" style={{animationDelay: '1s'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute top-40 left-16 text-pink-200 opacity-50 animate-float" style={{animationDelay: '3s'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute top-24 left-64 text-pink-300 opacity-35 animate-float-reverse" style={{animationDelay: '2.5s'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute top-60 left-8 text-pink-400 opacity-45 animate-float" style={{animationDelay: '4s'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute bottom-32 left-20 text-pink-300 opacity-55 animate-float-reverse" style={{animationDelay: '1.5s'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute bottom-16 left-48 text-pink-200 opacity-40 animate-float" style={{animationDelay: '3.5s'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>

          {/* Sağ Taraf Sakuralar */}
          <div className="absolute top-20 right-16 text-pink-300 opacity-50 animate-float-reverse" style={{animationDelay: '2s'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute top-48 right-32 text-pink-400 opacity-60 animate-float" style={{animationDelay: '0.5s'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute top-1/2 right-10 text-pink-200 opacity-45 animate-float-reverse" style={{animationDelay: '4.5s'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute bottom-24 right-24 text-pink-300 opacity-55 animate-float" style={{animationDelay: '2.8s'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>
          <div className="absolute bottom-40 right-8 text-pink-400 opacity-40 animate-float-reverse" style={{animationDelay: '1.8s'}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>

          {/* Yıldızlar - Daha Çok */}
          <div className="absolute top-32 right-20 text-cyan-300 opacity-40 animate-float-reverse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <div className="absolute top-12 right-1/3 text-cyan-200 opacity-35 animate-float" style={{animationDelay: '2.2s'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <div className="absolute top-56 right-1/2 text-cyan-400 opacity-50 animate-float-reverse" style={{animationDelay: '3.8s'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <div className="absolute bottom-12 right-1/3 text-cyan-300 opacity-45 animate-float" style={{animationDelay: '1.3s'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>

          {/* Sol Taraf Yıldızlar */}
          <div className="absolute top-28 left-1/4 text-cyan-200 opacity-40 animate-float-reverse" style={{animationDelay: '4.2s'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <div className="absolute bottom-20 left-1/4 text-purple-300 opacity-50 animate-float">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div className="absolute top-2/3 left-12 text-purple-200 opacity-35 animate-float-reverse" style={{animationDelay: '2.7s'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>

          {/* Orta Alanda Floating Elementler */}
          <div className="absolute top-1/3 left-1/2 text-purple-400 opacity-30 animate-float" style={{animationDelay: '3.3s'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <div className="absolute top-3/4 left-3/4 text-pink-300 opacity-40 animate-float-reverse" style={{animationDelay: '0.8s'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
              <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
            </svg>
          </div>

          {/* Gradient Orbs - Daha Fazla */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-15 animate-pulse-slow blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-12 animate-pulse-slow blur-2xl"></div>
          <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-18 animate-pulse-slow blur-lg" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/2 right-1/6 w-36 h-36 bg-gradient-to-r from-cyan-300 to-indigo-400 rounded-full opacity-15 animate-pulse-slow blur-xl" style={{animationDelay: '3s'}}></div>
        </div>

        <main className="flex-grow w-full relative z-10">
          {/* Hero Section */}
          <div className="text-center py-20 px-4">
            <h1 className="text-6xl md:text-8xl font-black mb-6 animate-title-gradient">
              AnimeConnect
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 font-light">
              Anime dünyasının kapılarını aralayın - incelemeler, topluluk ve rehberlik için tek adresiniz
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 relative">
              <div className="relative group">
                <input
                    type="text"
                    placeholder="Anime, manga, karakter ara..."
                    className="w-full px-6 py-4 pl-14 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-2 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
                  Ara
                </button>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {['🎌 Anime', '📚 Manga', '👥 Karakterler', '🔥 Trending', '⭐ En İyiler'].map((tag, index) => (
                  <span
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                {tag}
              </span>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="px-4 md:px-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Reviews Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-6">⭐</div>
                  <h3 className="text-xl font-bold text-white mb-4">İncelemeler</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Anime ve manga için otantik kullanıcı değerlendirmelerini keşfedin ve paylaşın
                  </p>
                </div>
              </div>

              {/* Discovery Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-6">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-4">Keşif</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yeni anime serileri ve gizli kalmış incileri bulun
                  </p>
                </div>
              </div>

              {/* Community Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-6">👥</div>
                  <h3 className="text-xl font-bold text-white mb-4">Topluluk</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Anime tutkunlarıyla bağlantı kurun ve deneyimlerinizi paylaşın
                  </p>
                </div>
              </div>

              {/* Top Series Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-6">🏆</div>
                  <h3 className="text-xl font-bold text-white mb-4">En İyi Seriler</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Trend olan ve güvenilir anime serilerini keşfedin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }

          @keyframes float-reverse {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-10px) rotate(-3deg); }
          }

          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.1; }
          }

          @keyframes title-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-reverse { animation: float-reverse 6s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
          .animate-title-gradient {
            background: linear-gradient(90deg, #ffffff 0%, #06b6d4 25%, #3b82f6 50%, #8b5cf6 75%, #ffffff 100%);
            background-size: 200% 200%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: title-gradient 8s linear infinite;
          }
        `}</style>
      </div>
  );
};

export default AnimeHomePage;