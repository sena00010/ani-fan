"use client"
import React from 'react';

const Anime404Page = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex flex-col items-center justify-center overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Sakura Petals */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-pink-300 opacity-60 animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                        }}
                    >
                        <svg width={12 + Math.random() * 8} height={12 + Math.random() * 8} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
                            <path d="M12 22C13 20 13 17 9 17C5 17 3 20 1 21C3 22 5 25 9 25C13 25 13 22 12 22Z"/>
                        </svg>
                    </div>
                ))}

                {/* Stars */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={`star-${i}`}
                        className="absolute text-cyan-300 opacity-40 animate-float-reverse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${4 + Math.random() * 3}s`
                        }}
                    >
                        <svg width={16 + Math.random() * 6} height={16 + Math.random() * 6} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                        </svg>
                    </div>
                ))}

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse-slow blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-15 animate-pulse-slow blur-2xl"></div>
                <div className="absolute top-1/2 right-1/6 w-24 h-24 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-25 animate-pulse-slow blur-lg"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                {/* Cute Anime Character (Using Emoji) */}
                <div className="mb-6 relative">
                    <div className="text-6xl md:text-7xl mb-3 animate-bounce-slow">
                        🌸
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-float">
                        😅
                    </div>
                </div>

                {/* 404 Number with Anime Style */}
                <div className="mb-6">
                    <h1 className="text-6xl md:text-7xl font-black mb-3 animate-title-gradient leading-none">
                        404
                    </h1>
                    <div className="flex justify-center items-center gap-2 mb-3">
                        <span className="text-xl">🎌</span>
                        <p className="text-lg md:text-xl text-pink-200 font-medium">
                            Aradığınız sayfa kaybolmuş
                        </p>
                        <span className="text-xl">🎌</span>
                    </div>
                </div>

                {/* Anime-style Message */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-2 right-2 text-pink-300 opacity-60">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
                        </svg>
                    </div>
                    <div className="absolute bottom-2 left-2 text-cyan-300 opacity-50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                        </svg>
                    </div>

                    <div className="text-center relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                            <span>🌸</span>
                            Ups! Sayfayı bulamadık
                            <span>🌸</span>
                        </h2>
                        <p className="text-base text-gray-200 mb-4 leading-relaxed">
                            Aradığınız anime sayfası başka bir dünyaya geçmiş olabilir!
                            <br/>
                            Merak etmeyin, ana sayfamızdan favori animelerinizi bulabilirsiniz.
                        </p>

                        {/* Anime Quote */}
                        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-3 mb-4 border border-pink-300/30">
                            <p className="text-pink-200 italic font-medium text-base">
                                "Kayıp olmak bazen yeni yollar keşfetmek demektir!"
                            </p>
                            <p className="text-pink-300 text-sm mt-1">
                                - Anime Rehberi
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                <span className="flex items-center gap-2">
                  🏠 Ana Sayfaya Dön
                </span>
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button
                                onClick={() => window.history.back()}
                                className="group relative bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                            >
                <span className="flex items-center gap-2">
                  ⬅️ Geri Dön
                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Popular Anime Suggestions */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center justify-center gap-2">
                        <span>⭐</span>
                        Popüler Animeler
                        <span>⭐</span>
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['🎯 Attack on Titan', '🔥 Demon Slayer', '⚡ Naruto', '🌟 One Piece', '💫 My Hero Academia'].map((anime, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-300/30 rounded-full text-blue-200 text-sm hover:bg-blue-500/30 cursor-pointer transition-all duration-300 hover:scale-105"
                            >
                {anime}
              </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    33% {
                        transform: translateY(-15px) rotate(5deg);
                    }
                    66% {
                        transform: translateY(-5px) rotate(-3deg);
                    }
                }

                @keyframes float-reverse {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(-5deg);
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-10px) scale(1.05);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.15;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.25;
                        transform: scale(1.1);
                    }
                }

                @keyframes title-gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 6s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .animate-title-gradient {
                    background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #ff6b9d, #40407a, #ff6b9d);
                    background-size: 300% 300%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    animation: title-gradient 6s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Anime404Page;