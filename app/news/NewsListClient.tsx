'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewsItem {
    id: number;
    source_id: number;
    hash_key: string;
    title: string;
    summary: string;
    link: string;
    lang: string;
    published_at: string;
    fetched_at: string;
    source: string;
}

export default function NewsListClient({ initialNews }: { initialNews: NewsItem[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const itemsPerPage = 10;

    const totalPages = Math.ceil(initialNews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNews = initialNews.slice(startIndex, endIndex);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const getSourceBadgeColor = (source: string) => {
        const colors: Record<string, string> = {
            'www.animenewsnetwork.com': 'bg-blue-600',
            'natalie.mu': 'bg-pink-600',
        };
        return colors[source] || 'bg-purple-600';
    };

    const handleNewsClick = (id: number) => {
        router.push(`/news/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                Anime News
                            </h1>
                            <p className="text-purple-300 mt-1">En son anime haberleri ve güncellemeler</p>
                        </div>
                        <div className="text-purple-300 text-sm">
                            {initialNews.length} haber bulundu
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {currentNews.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer group"
                            onClick={() => handleNewsClick(item?.id)}
                        >
                            {/* Görsel alanı */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <div className="absolute top-4 left-4 z-20">
                  <span className={`${getSourceBadgeColor(item.source)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                    NEWS
                  </span>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="p-5">
                                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                    {item.title}
                                </h2>

                                <p className="text-purple-200 text-sm mb-4 line-clamp-3">
                                    {item.summary}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center text-purple-400">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{formatDate(item.published_at)}</span>
                                    </div>

                                    <div className="flex items-center text-purple-400">
                    <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">
                      {item.lang === 'ja' ? '🇯🇵 Japonca' : '🇬🇧 İngilizce'}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Sayfalama */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Önceki
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                                        currentPage === index + 1
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/5 text-purple-300 hover:bg-white/10'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            Sonraki
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}