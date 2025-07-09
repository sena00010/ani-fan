import { Calendar, Eye, Tag } from 'lucide-react';

const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export default function NewsDetailLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section Loading */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Category Badge Loading */}
                    <Skeleton className="h-6 w-24 rounded-full mb-4" />

                    {/* Title Loading */}
                    <div className="space-y-3 mb-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-3/4" />
                    </div>

                    {/* Meta Info Loading */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-300" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-300" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section Loading */}
            <div className="container mx-auto px-4 pb-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">

                        {/* Image Loading */}
                        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden bg-gray-100">
                            <Skeleton className="w-full h-full" />
                        </div>

                        {/* Article Content Loading */}
                        <div className="p-8">
                            {/* Breadcrumb Loading */}
                            <nav className="mb-6">
                                <Skeleton className="h-4 w-32" />
                            </nav>

                            {/* Content Loading */}
                            <article className="prose prose-lg max-w-none">
                                {/* Paragraphs Loading */}
                                <div className="space-y-4">
                                    {/* First paragraph */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>

                                    {/* Second paragraph */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </div>

                                    {/* Heading Loading */}
                                    <div className="mt-8">
                                        <Skeleton className="h-8 w-2/3 mb-4" />
                                    </div>

                                    {/* More paragraphs */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>

                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>

                                    {/* Another heading */}
                                    <div className="mt-6">
                                        <Skeleton className="h-6 w-1/2 mb-3" />
                                    </div>

                                    {/* List items loading */}
                                    <div className="space-y-2 pl-6">
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-4/5" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>

                                    {/* Final paragraphs */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            </article>

                            {/* Tags Section Loading */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag className="w-5 h-5 text-gray-300" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-8 w-20 rounded-full" />
                                    <Skeleton className="h-8 w-16 rounded-full" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}