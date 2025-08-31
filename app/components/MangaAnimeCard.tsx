import { CommonCardData } from "@/lib/mangaAnimeInterface";

interface MangaAnimeCardProps {
    data: CommonCardData[]; // Array olmalı
    onCardClick?: (item: CommonCardData) => void;
}

export default function MangaAnimeCard({ data, onCardClick }: MangaAnimeCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Publishing':
            case 'Currently Airing':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Finished':
            case 'Finished Airing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Hiatus':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getScoreColor = (score: number | null) => {
        if (!score) return 'text-gray-600';
        if (score >= 9.0) return 'text-green-600 font-bold';
        if (score >= 8.0) return 'text-blue-600 font-semibold';
        if (score >= 7.0) return 'text-yellow-600 font-medium';
        return 'text-gray-600';
    };

    const handleCardClick = (item: CommonCardData) => {
        if (onCardClick) {
            onCardClick(item);
        }
    };

    const renderMediaInfo = (item: CommonCardData) => {
        if (item.type === 'anime') {
            return (
                <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                        <span>Episodes: {item.episodeCount || 'N/A'}</span>
                        <span>Studio: {item.studio || 'N/A'}</span>
                    </div>
                    {item.releaseDate && (
                        <div className="text-xs">
                            Year: {new Date(item.releaseDate).getFullYear()}
                            {item.endDate && ` - ${new Date(item.endDate).getFullYear()}`}
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                        <span>Chapters: {item.chapters || 'N/A'}</span>
                        <span>Volumes: {item.volumes || 'N/A'}</span>
                    </div>
                    {item.publishedFrom && (
                        <div className="text-xs">
                            Year: {new Date(item.publishedFrom).getFullYear()}
                            {item.publishedTo && ` - ${new Date(item.publishedTo).getFullYear()}`}
                        </div>
                    )}
                </div>
            );
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No content found</h3>
                    <p className="text-gray-600 mb-4">No data available to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        {data[0]?.type === 'anime' ? 'Animes List' : 'Mangas List'}
                    </h1>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {data.length} {data[0]?.type === 'anime' ? 'anime' : 'manga'}
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {data.map((item) => (
                        <div
                            key={`${item.type}-${item.id}`}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                            onClick={() => handleCardClick(item)}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=No+Image'}
                                    alt={item.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=No+Image';
                                    }}
                                />

                                {/* Score Badge */}
                                {item.score && (
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(item.score)} bg-white/90 backdrop-blur-sm`}>
                                            ★ {item.score.toFixed(1)}
                                        </span>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute bottom-2 left-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        item.type === 'anime' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                                    }`}>
                                        {item.type.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>

                                {item.titleJapanese && (
                                    <div className="text-sm text-gray-500 mb-2">
                                        {item.titleJapanese}
                                    </div>
                                )}

                                {item.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                        {item.description}
                                    </p>
                                )}

                                {/* Media specific info */}
                                {renderMediaInfo(item)}

                                {/* Genres */}
                                {item.genres && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {item.genres.split(',').slice(0, 3).map((genre, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                            >
                                                {genre.trim()}
                                            </span>
                                        ))}
                                        {item.genres.split(',').length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                +{item.genres.split(',').length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}