import { ChevronRight, Globe } from "lucide-react";

const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export default function NewsLoading() {
    return (
        <div className="pb-12 pt-8 bg-gray-50 min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-green-200/20 to-blue-200/20 blur-3xl" />
                <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Loading */}
                <div className="text-center mb-8">
                    <Skeleton className="h-10 w-32 mx-auto mb-2" />
                    <Skeleton className="h-5 w-48 mx-auto" />
                </div>

                {/* Category Filter Buttons Loading */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {/* All button */}
                    <div className="px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium">
                        All
                    </div>

                    {/* Category buttons loading */}
                    {[...Array(6)].map((_, index) => (
                        <Skeleton key={index} className="h-8 w-20 rounded-full" />
                    ))}
                </div>

                {/* News Grid Loading */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(16)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                            >
                                {/* Image placeholder */}
                                <div className="relative w-full aspect-[4/3.5] overflow-hidden rounded-t-xl">
                                    <Skeleton className="w-full h-full" />
                                </div>

                                {/* Content placeholder */}
                                <div className="p-4">
                                    {/* Category badge */}
                                    <Skeleton className="h-3 w-16 mb-2 rounded" />

                                    {/* Title */}
                                    <div className="space-y-2 mb-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>

                                    {/* Read more section */}
                                    <div className="flex items-center justify-between mt-4">
                                        <Skeleton className="h-3 w-16" />
                                        <div className="text-gray-300">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Loading */}
                <div className="flex justify-center items-center gap-2">
                    <Skeleton className="h-10 w-20 rounded-lg" />

                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
                        ))}
                    </div>

                    <Skeleton className="h-10 w-16 rounded-lg" />
                </div>
            </div>
        </div>
    );
}