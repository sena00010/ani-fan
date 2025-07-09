'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '@/store/slices/newsSlice';
import Image from 'next/image';
import { Calendar, Eye, Tag } from 'lucide-react';
import {AppDispatch} from "@/store";

interface NewsResponse {
    news_id: string;
    category_id: string;
    news_name: string;
    news_slug_url: string;
    news_content: string;
    news_image: string;
    schedule_status: string;
    schedule_date: string;
    news_status: string;
    created_date: string;
    updated_date: string;
    category_name: string;
    total_views: string;
}

export default function NewsDetailPage({ params }: { params: { news_slug_url: string } }) {
    const dispatch = useDispatch<AppDispatch>();
    const [news, setNews] = useState<NewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNewsDetail = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await dispatch(fetchNews({
                news_slug_url: params.news_slug_url
            })).unwrap();
            if (result) {
                setNews(result);
            }
        } catch (error) {
            console.error("Haber yüklenirken hata oluştu:", error);
            setError("There was an error loading the news.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsDetail();
    }, [params.news_slug_url]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || "News not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Category Badge */}
                    <span className="inline-block px-4 py-1 bg-green-500 text-white text-sm font-semibold rounded-full mb-4">
                        {news.category_name}
                    </span>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {news.news_name}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-gray-600 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{news.created_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{news.total_views} view</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 pb-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden bg-gray-100">
                            {/* Blur arka plan */}
                            <Image
                                src={news.news_image}
                                alt={news.news_name}
                                fill
                                className="object-cover blur-sm scale-110"
                                aria-hidden="true"
                                loading="lazy"
                            />

                            {/* Asıl Görsel */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Image
                                    src={news.news_image}
                                    alt={news.news_name}
                                    width={800}
                                    height={450}
                                    className="object-contain max-h-full max-w-full z-10"
                                />
                            </div>
                        </div>



                        {/* Article Content */}
                        <div className="p-8">
                            {/* Breadcrumb */}
                            <nav className="text-sm mb-6">
                                <ol className="flex items-center space-x-2">
                                    <li className="text-gray-900">{news.news_name}</li>
                                </ol>
                            </nav>

                            {/* Content */}
                            <article className="prose prose-lg max-w-none">
                                <div
                                    dangerouslySetInnerHTML={{ __html: news.news_content }}
                                    className="text-gray-700 leading-relaxed [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4"
                                />
                            </article>

                            {/* Tags Section */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer">
                                        {news.category_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}