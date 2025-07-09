const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export default function CommunityDetailLoading() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Community Banner Loading */}
            <div className="relative overflow-hidden bg-[#040718] text-white h-36 sm:h-48">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-purple-900/40 z-0"></div>
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute -left-20 top-1/2 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
                </div>

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-3 sm:space-y-0">
                            {/* Community Avatar and Name Loading */}
                            <div className="flex items-end space-x-3">
                                <div className="relative">
                                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
                                </div>
                                <div className="mb-0 sm:mb-2">
                                    <Skeleton className="h-6 sm:h-9 w-32 sm:w-48 mb-2" />
                                    <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
                                </div>
                            </div>

                            {/* Buttons Loading */}
                            <div className="flex self-end space-x-2 sm:space-x-3">
                                <Skeleton className="h-8 sm:h-11 w-16 sm:w-20 rounded-md" />
                                <Skeleton className="h-8 sm:h-11 w-8 sm:w-11 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Loading */}
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Main Feed Loading */}
                    <div className="flex-1">
                        {/* Create Post Card Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
                            <div className="p-2">
                                <div className="flex items-center gap-2 p-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="flex-grow h-10 rounded-full" />
                                </div>

                                <div className="flex border-t border-gray-200 dark:border-gray-700 mt-1">
                                    <div className="flex-1 p-2">
                                        <Skeleton className="h-8 w-full rounded-md" />
                                    </div>
                                    <div className="flex-1 p-2">
                                        <Skeleton className="h-8 w-full rounded-md" />
                                    </div>
                                    <div className="flex-1 p-2">
                                        <Skeleton className="h-8 w-full rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts Loading */}
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                    <div className="flex">
                                        {/* Vote Sidebar Loading */}
                                        <div className="w-10 md:w-12 flex flex-col items-center pt-2 bg-gray-50 dark:bg-gray-900">
                                            <Skeleton className="w-6 h-6 mb-1" />
                                            <Skeleton className="w-8 h-4 mb-1" />
                                            <Skeleton className="w-6 h-6" />
                                        </div>

                                        {/* Post Content Loading */}
                                        <div className="flex-1 p-3">
                                            {/* Post Header Loading */}
                                            <div className="flex items-center mb-3">
                                                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                                <div className="flex-grow">
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                            </div>

                                            {/* Post Title Loading */}
                                            <Skeleton className="h-6 w-3/4 mb-2" />

                                            {/* Post Content Loading */}
                                            <div className="space-y-2 mb-4">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-5/6" />
                                                <Skeleton className="h-4 w-2/3" />
                                            </div>

                                            {/* Post Image Loading (random) */}
                                            {index % 3 === 0 && (
                                                <Skeleton className="h-64 w-full rounded-lg mb-4" />
                                            )}

                                            {/* Poll Loading (random) */}
                                            {index % 4 === 1 && (
                                                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-12 w-full rounded" />
                                                        <Skeleton className="h-12 w-full rounded" />
                                                        <Skeleton className="h-12 w-full rounded" />
                                                    </div>
                                                    <div className="flex justify-between mt-3">
                                                        <Skeleton className="h-3 w-16" />
                                                        <Skeleton className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Post Actions Loading */}
                                            <div className="flex items-center mt-4">
                                                <Skeleton className="h-6 w-20 mr-4" />
                                                <Skeleton className="h-6 w-16 mr-4" />
                                                <Skeleton className="h-6 w-12" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State Alternative */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin h-8 w-8 text-blue-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading community posts...
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Loading */}
                    <div className="hidden md:block w-80 space-y-4">
                        {/* Community Info Card Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center mb-3">
                                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                    <Skeleton className="h-6 w-32" />
                                </div>

                                <div className="space-y-2 mb-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>

                                {/* Stats Loading */}
                                <div className="grid grid-cols-2 gap-2 text-center mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <div>
                                        <Skeleton className="h-5 w-12 mx-auto mb-1" />
                                        <Skeleton className="h-3 w-16 mx-auto" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-5 w-8 mx-auto mb-1" />
                                        <Skeleton className="h-3 w-12 mx-auto" />
                                    </div>
                                </div>

                                {/* Join Button Loading */}
                                <div className="flex space-x-2">
                                    <Skeleton className="h-11 flex-1 rounded-md" />
                                    <Skeleton className="h-11 w-11 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* About Community Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <div className="p-4">
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center">
                                        <Skeleton className="h-3 w-16 mr-2" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                                <div className="flex items-center">
                                    <Skeleton className="w-4 h-4 mr-2" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </div>

                        {/* Moderators Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                    <div>
                                        <Skeleton className="h-4 w-20 mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}