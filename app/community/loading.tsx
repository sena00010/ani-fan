const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export default function CommunityLoading() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-4 grid grid-cols-12 gap-4">

                {/* Left Sidebar Loading */}
                <aside className="col-span-12 md:col-span-3 lg:col-span-2 space-y-4">
                    {/* User Profile Box Loading */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-1" />
                            </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            <div className="text-center flex-1">
                                <Skeleton className="h-4 w-8 mx-auto mb-1" />
                                <Skeleton className="h-3 w-12 mx-auto" />
                            </div>
                            <div className="text-center flex-1 border-x border-gray-200 dark:border-gray-700">
                                <Skeleton className="h-4 w-8 mx-auto mb-1" />
                                <Skeleton className="h-3 w-16 mx-auto" />
                            </div>
                            <div className="text-center flex-1">
                                <Skeleton className="h-4 w-8 mx-auto mb-1" />
                                <Skeleton className="h-3 w-10 mx-auto" />
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <nav>
                                <ul className="space-y-1">
                                    <li>
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </li>
                                    <li>
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Create Community Button Loading */}
                    <Skeleton className="h-12 w-full rounded-lg" />

                    {/* Communities List Loading */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <nav className="p-2">
                            <ul className="space-y-1">
                                {[...Array(3)].map((_, i) => (
                                    <li key={i}>
                                        <div className="flex items-center px-3 py-2">
                                            <Skeleton className="w-6 h-6 rounded-full mr-3" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                    </div>
                </aside>

                {/* Main Content Loading */}
                <main className="col-span-12 md:col-span-9 lg:col-span-7">
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
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                                <div className="flex">
                                    {/* Vote Buttons Loading */}
                                    <div className="flex flex-col items-center mr-4">
                                        <Skeleton className="w-6 h-6 mb-1" />
                                        <Skeleton className="w-8 h-4 mb-1" />
                                        <Skeleton className="w-6 h-6" />
                                    </div>

                                    {/* Post Content Loading */}
                                    <div className="flex-1">
                                        {/* Post Header Loading */}
                                        <div className="flex items-center mb-3">
                                            <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                            <div>
                                                <Skeleton className="h-4 w-24 mb-1" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
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
                                            <div className="mb-4 space-y-2">
                                                <Skeleton className="h-12 w-full rounded-md" />
                                                <Skeleton className="h-12 w-full rounded-md" />
                                                <Skeleton className="h-12 w-full rounded-md" />
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

                        {/* Load More Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
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
                  Loading posts...
                </span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar Loading */}
                <aside className="hidden lg:block lg:col-span-3 space-y-4">
                    {/* Popular Communities Loading */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="p-4">
                            <ul className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <li key={i} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Skeleton className="h-8 w-8 rounded-full mr-3" />
                                            <div>
                                                <Skeleton className="h-4 w-20 mb-1" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-8" />
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Skeleton className="h-6 w-full rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Who to Follow Loading */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="p-4">
                            <ul className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <li key={i} className="flex items-start justify-between">
                                        <div className="flex items-start">
                                            <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                            <div className="flex-1 min-w-0">
                                                <Skeleton className="h-4 w-20 mb-1" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}