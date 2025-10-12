import React from 'react';
import NewsListClient from './NewsListClient';
import { preloadNewsList } from '@/lib/server/preloadData';

export default async function NewsPage() {
    const newsData = await preloadNewsList();

    return <NewsListClient initialNews={newsData || []} />;
}