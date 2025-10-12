'use client';

import React from 'react';
import { Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ✅ API'den dönen veri yapısıyla uyumlu interface
interface NewsDetailItem {
    id: number;
    news_id: number;
    lang: string;
    url: string;
    title: string;
    description: string;
    image: string;
    author: string;
    content_text: string;
    published_at: string;
    fetched_at: string;
}

export default function NewsDetailClient({
                                             newsDetail,
                                             newsId
                                         }: {
    newsDetail: NewsDetailItem[] | null;
    newsId: string;
}) {
    const router = useRouter();
    console.log(newsDetail,"newsDetail")
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Belirtilmemiş';

        const date = new Date(dateString);
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const getSourceBadgeColor = (lang: string) => {
        return lang === 'ja' ? 'bg-pink-600' : 'bg-blue-600';
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

    newsDetail;

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
                </div>
            </header>

            {/* Detay İçeriği */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <article className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20">
                    {/* Görsel Varsa */}
                    {newsDetail?.image && (
                        <div className="w-full h-64 md:h-96 overflow-hidden bg-black/20">
                            <img
                                src={newsDetail.image}
                                alt={newsDetail.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Başlık Bölümü */}
                    <div className="p-8 border-b border-purple-500/20">
                        <div className="flex items-start gap-4 mb-6">
                            <span className={`${getSourceBadgeColor(newsDetail?.lang)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                                NEWS
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                {newsDetail?.lang === 'ja' ? '🇯🇵 Japonca' : '🇬🇧 İngilizce'}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                            {newsDetail.title}
                        </h1>

                        <div className="flex items-center gap-6 text-purple-300 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Yayınlanma: {formatDate(newsDetail.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Alındı: {formatDate(newsDetail.fetched_at)}</span>
                            </div>
                            {newsDetail.author && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">Yazar: {newsDetail.author}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Açıklama */}
                    {newsDetail.description && (
                        <div className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-b border-purple-500/20">
                            <h2 className="text-xl font-bold text-purple-300 mb-3">Özet</h2>
                            <p className="text-lg text-purple-100 leading-relaxed">
                                {newsDetail.description}
                            </p>
                        </div>
                    )}

                    {/* İçerik Metni */}
                    {newsDetail.content_text && (
                        <div className="p-8 border-b border-purple-500/20">
                            <h2 className="text-xl font-bold text-purple-300 mb-4">Detaylı İçerik</h2>
                            <div className="text-purple-100 leading-relaxed whitespace-pre-wrap">
                                {newsDetail.content_text}
                            </div>
                        </div>
                    )}

                    {/* Orijinal Link */}
                    {newsDetail.url && (
                        <div className="p-8 border-t border-purple-500/20">
                            <a
                                href={newsDetail.url}
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
                        <div className="flex items-center justify-between text-sm text-purple-400 flex-wrap gap-4">
                            <span>Haber ID: <strong>{newsDetail.news_id}</strong></span>
                            <span>Detay ID: {newsDetail.id}</span>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}