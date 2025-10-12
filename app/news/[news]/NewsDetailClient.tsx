'use client';

import React from 'react';
import { Calendar, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewsDetailItem {
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

export default function NewsDetailClient({
                                             newsDetail,
                                             newsId
                                         }: {
    newsDetail: NewsDetailItem[] | null;
    newsId: string;
}) {
    const router = useRouter();

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

    if (!newsDetail || newsDetail.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl text-purple-300 mb-6">Haber bulunamadı</p>
                    <button
                        onClick={() => router.push('/news')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        Haberlere Dön
                    </button>
                </div>
            </div>
        );
    }

    const news = newsDetail[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => router.push('/news')}
                        className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Haberlere Dön
                    </button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Haber Detayı
                    </h1>
                </div>
            </header>

            {/* Detay İçeriği */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <article className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20">
                    {/* Başlık Bölümü */}
                    <div className="p-8 border-b border-purple-500/20">
                        <div className="flex items-start gap-4 mb-6">
                            <span className={`${getSourceBadgeColor(news.source)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                                NEWS
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                {news.lang === 'ja' ? '🇯🇵 Japonca' : '🇬🇧 İngilizce'}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                            {news.title}
                        </h1>

                        <div className="flex items-center gap-6 text-purple-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Yayınlanma: {formatDate(news.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Alındı: {formatDate(news.fetched_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Özet */}
                    <div className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-b border-purple-500/20">
                        <h2 className="text-xl font-bold text-purple-300 mb-3">Özet</h2>
                        <p className="text-lg text-purple-100 leading-relaxed">
                            {news.summary}
                        </p>
                    </div>

                    {/* Orijinal Link */}
                    {news.link && (
                        <div className="p-8 border-t border-purple-500/20">
                            <a
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg shadow-purple-500/30"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Orijinal Haberi Oku
                            </a>
                        </div>
                    )}

                    {/* Kaynak Bilgisi */}
                    <div className="p-8 bg-black/20 border-t border-purple-500/20">
                        <div className="flex items-center justify-between text-sm text-purple-400">
                            <span>Kaynak: <strong>{news.source}</strong></span>
                            <span>ID: {news.id}</span>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}