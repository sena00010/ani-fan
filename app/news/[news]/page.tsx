import React from 'react';
import NewsDetailClient from './NewsDetailClient';
import { preloadNewsDetail } from '@/lib/server/preloadData';

export default async function NewsDetailPage({
                                                 params
                                             }: {
    params: Promise<{ news: string }> //
}) {
    const resolvedParams = await params; // ✅ Önce resolve et
    console.log(resolvedParams,"resolvedParams")
    const newsDetail = await preloadNewsDetail(resolvedParams.news);

    return <NewsDetailClient newsDetail={newsDetail} newsId={resolvedParams.news} />;
}