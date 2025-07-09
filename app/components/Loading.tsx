// Ana component'inizin en üstüne bu loading component'ini ekleyin:

// Skeleton Component
import {User} from "lucide-react";

const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

// Loading Component (ana component içinde)
export  const LoadingComp = () => (
    <div className="min-h-screen bg-[#f8fafc]">
        {/* Header Loading */}
        <div className="relative overflow-hidden bg-[#040718] text-white">
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                    {/* Profile Image Loading */}
                    <div className="w-36 h-36 md:w-48 md:h-48 rounded-full ring-4 ring-white/20 shadow-2xl bg-gray-600 animate-pulse flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                    </div>

                    {/* Profile Info Loading */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap gap-3 mb-3 justify-center md:justify-start">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                        <Skeleton className="h-10 w-64 mb-2 mx-auto md:mx-0" />
                        <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="mb-6 max-w-2xl mx-auto md:mx-0">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Stats Loading */}
        <div className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center md:justify-between py-4 gap-6">
                    <div className="flex items-center gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="text-center px-4 flex flex-col items-center">
                                <Skeleton className="h-8 w-12 mb-1" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>
        </div>

        {/* Content Loading */}
        <div className="container mx-auto px-4 py-8">
            <div className="flex border-b mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-8 py-4">
                        <Skeleton className="h-6 w-20" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <Skeleton className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-24 mb-1" />
                                        <Skeleton className="h-4 w-32" />
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

