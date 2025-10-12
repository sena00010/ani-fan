import React from 'react';
import NewsDetailClient from './NewsDetailClient';
import { preloadNewsDetail } from '@/lib/server/preloadData';

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    const newsDetail = await preloadNewsDetail(params.id);

    return <NewsDetailClient newsDetail={newsDetail} newsId={params.id} />;
}