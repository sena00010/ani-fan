export default function Loading() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="relative overflow-hidden bg-[#040718] text-white">
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gray-600 animate-pulse flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-500 rounded-full"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-3"></div>
                            <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mb-4"></div>
                            <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mb-6"></div>
                            <div className="flex gap-4">
                                <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
                                <div className="h-10 w-28 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between">
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mb-1"></div>
                                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mb-1"></div>
                                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mb-1"></div>
                                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex border-b mb-8">
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="px-8 py-4">
                            <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {[1,2,3].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                                    <div>
                                        <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-1"></div>
                                        <div className="h-3 w-48 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-1"></div>
                                <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
                            {[1,2,3].map((i) => (
                                <div key={i} className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                                    <div>
                                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-1"></div>
                                        <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}