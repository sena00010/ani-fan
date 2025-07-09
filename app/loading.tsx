"use client";
import React from "react";
import {
    Star,
    ShoppingBag,
    Users,
    Award,
    Search,
    Store,
    Tag,
} from "lucide-react";

const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

const AnimatedBackgroundSkeleton = () => (
    <div className="absolute inset-0 overflow-hidden">
        {/* Floating elements - static for skeleton */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-purple-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-32 w-20 h-20 bg-indigo-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 right-16 w-14 h-14 bg-pink-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-green-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-18 h-18 bg-yellow-200 rounded-full opacity-30"></div>
    </div>
);

export default function HomePageSearchSkeleton() {
    return (
        <div className="pt-0">
            <div className="relative min-h-[600px] flex flex-col items-center justify-center py-16 overflow-hidden rounded-b-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">

                {/* Animated Background Skeleton */}
                <AnimatedBackgroundSkeleton />

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

                    {/* Main Title Skeleton */}
                    <div className="mb-6">
                        <div className="flex items-center justify-center flex-wrap">
                            <Skeleton className="h-12 md:h-16 w-48 md:w-64 mr-4 mb-2" />
                            <div className="relative">
                                <Skeleton className="h-12 md:h-16 w-64 md:w-80" />
                                <div className="absolute inset-0 -z-10 bg-indigo-100 rounded-lg -m-1 p-1 opacity-50"></div>
                            </div>
                        </div>
                    </div>

                    {/* Subtitle Skeleton */}
                    <div className="mb-6 max-w-3xl mx-auto">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                    </div>

                    {/* Search Bar Skeleton */}
                    <div className="relative max-w-2xl mx-auto mb-12 px-2 sm:px-0">
                        <div className="relative">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div className="w-full py-3 md:py-4 pl-12 pr-16 md:pr-28 bg-white rounded-full border border-gray-200 shadow-lg">
                                    <Skeleton className="h-5 w-3/4" />
                                </div>
                                <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
                                    Search
                                </div>
                            </div>

                            {/* Search Categories Skeleton */}
                            <div className="flex items-center justify-center flex-wrap space-x-1 md:space-x-2 mt-3">
                                <div className="flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 mb-1">
                                    <Store className="w-4 h-4 mr-1 text-gray-400" />
                                    <span className="text-gray-400">Sources</span>
                                </div>
                                <div className="flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 mb-1">
                                    <Star className="w-4 h-4 mr-1 text-gray-400" />
                                    <span className="text-gray-400">Brands</span>
                                </div>
                                <div className="flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 mb-1">
                                    <Tag className="w-4 h-4 mr-1 text-gray-400" />
                                    <span className="text-gray-400">Products</span>
                                </div>
                                <div className="flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 mb-1">
                                    <span className="mr-1">🔥</span>
                                    <span>Trending</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mt-8">

                        {/* Reviews Feature */}
                        <div className="bg-white p-3 md:p-5 rounded-xl shadow-md flex flex-col items-center text-center">
                            <div className="p-2 md:p-3 bg-gray-50 rounded-full mb-2 md:mb-4">
                                <Star className="w-6 h-6 text-amber-500" />
                            </div>
                            <Skeleton className="h-5 md:h-6 w-16 mb-1 md:mb-2" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5 mx-auto" />
                            </div>
                        </div>

                        {/* Source Discovery Feature */}
                        <div className="bg-white p-3 md:p-5 rounded-xl shadow-md flex flex-col items-center text-center">
                            <div className="p-2 md:p-3 bg-gray-50 rounded-full mb-2 md:mb-4">
                                <ShoppingBag className="w-6 h-6 text-blue-500" />
                            </div>
                            <Skeleton className="h-5 md:h-6 w-24 mb-1 md:mb-2" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4 mx-auto" />
                            </div>
                        </div>

                        {/* Community Feature */}
                        <div className="bg-white p-3 md:p-5 rounded-xl shadow-md flex flex-col items-center text-center">
                            <div className="p-2 md:p-3 bg-gray-50 rounded-full mb-2 md:mb-4">
                                <Users className="w-6 h-6 text-green-500" />
                            </div>
                            <Skeleton className="h-5 md:h-6 w-20 mb-1 md:mb-2" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5 mx-auto" />
                            </div>
                        </div>

                        {/* Top Brands Feature */}
                        <div className="bg-white p-3 md:p-5 rounded-xl shadow-md flex flex-col items-center text-center">
                            <div className="p-2 md:p-3 bg-gray-50 rounded-full mb-2 md:mb-4">
                                <Award className="w-6 h-6 text-purple-500" />
                            </div>
                            <Skeleton className="h-5 md:h-6 w-20 mb-1 md:mb-2" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4 mx-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Additional Content Placeholders */}
                    <div className="mt-16 space-y-8">
                        {/* Stats Section Skeleton */}
                        <div className="flex justify-center items-center space-x-8 md:space-x-16">
                            <div className="text-center">
                                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                                <Skeleton className="h-4 w-12 mx-auto" />
                            </div>
                            <div className="text-center">
                                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                                <Skeleton className="h-4 w-16 mx-auto" />
                            </div>
                            <div className="text-center">
                                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                                <Skeleton className="h-4 w-14 mx-auto" />
                            </div>
                        </div>

                        {/* Popular Categories Skeleton */}
                        <div className="max-w-4xl mx-auto">
                            <Skeleton className="h-6 w-48 mx-auto mb-6" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                        <Skeleton className="h-12 w-12 mx-auto mb-3 rounded-full" />
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-3 w-3/4 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonials Skeleton */}
                        <div className="max-w-6xl mx-auto">
                            <Skeleton className="h-6 w-64 mx-auto mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                                        <div className="flex items-center mb-4">
                                            <Skeleton className="h-12 w-12 rounded-full mr-4" />
                                            <div>
                                                <Skeleton className="h-4 w-24 mb-1" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                        <div className="flex mt-4">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}