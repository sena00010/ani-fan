"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronRight,
    Globe,

} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchHomeTopNews, fetchNewsCategories } from "@/store/slices/newsSlice";

interface NewsResponse {
    news_id: string;
    news_name: string;
    news_slug_url: string;
    news_image: string;
    category_name: string;
    category_slug_url: string;
    position: string;
}

interface CategoryResponse {
    category_id: string;
    category_name: string;
    category_slug_url: string;
    category_type: string;
}

interface TransformedNews {
    id: number;
    name: string;
    slug: string;
    image: string;
    category: string;
    categorySlug: string;
    position: string;
}

interface NewsClientProps {
    initialTopNews?: NewsResponse[];
}

const NewsClient: React.FC<NewsClientProps> = ({ initialTopNews }:any) => {
    const dispatch = useDispatch<AppDispatch>();

    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [news, setNews] = useState<NewsResponse[]>(initialTopNews || []);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNews, setTotalNews] = useState(0);
    const newsPerPage = 16;

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const result = await dispatch(fetchHomeTopNews()).unwrap();
            console.log(result, "resultnews");
            console.log("Type of result:", typeof result);
            console.log("Is array:", Array.isArray(result));

            // Eğer result direkt array ise
            if (Array.isArray(result)) {
                setNews(result);
                setTotalNews(result.length);
            }
            // Eğer result.data içinde array varsa
            else if (result.data && Array.isArray(result.data)) {
                setNews(result.data);
                setTotalNews(result.totalCount || result.data.length);
            }
            // Eğer result direkt object ise ve içinde array varsa
            else if (result && typeof result === 'object') {
                const newsArray = Object.values(result).find(val => Array.isArray(val));
                if (newsArray) {
                    setNews(newsArray as NewsResponse[]);
                    setTotalNews(newsArray.length);
                }
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setNews([]);
            setTotalNews(0);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const result = await dispatch(fetchNewsCategories()).unwrap();
            console.log("Categories result:", result);

            // Kategoriler için de aynı mantığı uygulayalım
            if (Array.isArray(result)) {
                setCategories(result);
            } else if (result.data && Array.isArray(result.data)) {
                setCategories(result.data);
            } else if (result && typeof result === 'object') {
                const categoriesArray = Object.values(result).find(val => Array.isArray(val));
                if (categoriesArray) {
                    setCategories(categoriesArray as CategoryResponse[]);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };
    console.log(categories,"categories")
    useEffect(() => {
        fetchNews();
        fetchCategories();
    }, []);

    const totalPages = Math.ceil(totalNews / newsPerPage);

    // Filter news by category
    const filteredNews = selectedCategory === "All"
        ? news
        : news.filter(item => {
            // Debug için console.log ekleyelim
            console.log("Filtering item:", item, "Selected category:", selectedCategory);
            return item.category_slug_url === selectedCategory;
        });

    // Transform news for UI
    const transformedNews: TransformedNews[] = filteredNews?.map((newsItem, index) => {
        console.log("Transforming news item:", newsItem);
        return {
            id: newsItem.news_id ? parseInt(newsItem.news_id) : index,
            name: newsItem.news_name || 'Untitled News',
            slug: newsItem.news_slug_url || '',
            image: newsItem.news_image || "" ,
            category: newsItem.category_name || 'General',
            categorySlug: newsItem.category_slug_url || '',
            position: newsItem.position || '0',
        };
    }) || [];

    console.log("Transformed news:", transformedNews);

    return (
        <div className="pb-12 pt-8 bg-gray-50 min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-green-200/20 to-blue-200/20 blur-3xl" />
                <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">News</h1>
                    <p className="text-gray-600">You can view all news here</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === "All"
                                ? "bg-green-500 text-white"
                                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.category_id}
                            onClick={() => setSelectedCategory(category.category_slug_url)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === category.category_slug_url
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {category.category_name}
                        </button>
                    ))}
                </div>

                {/* News Grid */}
                <div className="mb-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
                                    <div className="w-full h-48 bg-gray-200"></div>
                                    <div className="p-4">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {transformedNews?.map((newsItem) => (
                                <Link
                                    key={newsItem.id}
                                    href={`/news/${newsItem.slug}`}
                                    className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative w-full aspect-[4/3.5] overflow-hidden rounded-t-xl">
                                        <Image
                                            src={newsItem.image}
                                            alt={newsItem.name}
                                            fill
                                            loading="lazy"
                                            // onError={}
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <div className="text-xs text-blue-600 font-medium mb-2 uppercase tracking-wide">
                                            {newsItem.category}
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {newsItem.name}
                                        </h3>

                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-sm text-gray-500">
                                                Read more
                                            </span>
                                            <ChevronRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && transformedNews.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Globe size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No news found</h3>
                            <p className="text-gray-500">Try selecting a different category or check back later.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg ${
                                            currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsClient;