"use client";
import { useState } from 'react';

interface Manga {
    id: number;
    title: string;
    title_english: string;
    title_japanese: string;
    synopsis: string;
    genres: string;
    chapters: number;
    volumes: number;
    status: string;
    published_from: string;
    published_to: string | null;
    score: number;
    image_url: string;
    mal_id: number;
    created_at: string;
    updated_at: string;
}

interface MangaPageClientProps {
    initialData: {
        Mangas: Manga[];
    };
}

const MangaPageClient: React.FC<MangaPageClientProps> = ({ initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortBy, setSortBy] = useState('score');

    const mangaArray = initialData?.Mangas || [];

    // Get unique genres
    const allGenres = Array.from(new Set(
        mangaArray.flatMap(manga =>
            manga.genres.split(', ').map(genre => genre.trim())
        )
    )).sort();

    // Get unique statuses
    const allStatuses = Array.from(new Set(
        mangaArray.map(manga => manga.status)
    )).sort();

    // Filter and sort manga
    const filteredAndSortedManga = mangaArray
        .filter(manga => {
            const matchesSearch = manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manga.title_english.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenre === 'All' || manga.genres.includes(selectedGenre);
            const matchesStatus = selectedStatus === 'All' || manga.status === selectedStatus;

            return matchesSearch && matchesGenre && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.score - a.score;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'chapters':
                    return b.chapters - a.chapters;
                case 'year':
                    return new Date(b.published_from).getFullYear() - new Date(a.published_from).getFullYear();
                default:
                    return 0;
            }
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Publishing':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Finished':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Hiatus':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 9.0) return 'text-green-600 font-bold';
        if (score >= 8.0) return 'text-blue-600 font-semibold';
        if (score >= 7.0) return 'text-yellow-600 font-medium';
        return 'text-gray-600';
    };

    if (!mangaArray.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No manga found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Mangas List</h1>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-64">
                            <input
                                type="text"
                                placeholder="Search manga titles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="All">All Genres</option>
                            {allGenres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="All">All Status</option>
                            {allStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="score">Sort by Score</option>
                            <option value="title">Sort by Title</option>
                            <option value="chapters">Sort by Chapters</option>
                            <option value="year">Sort by Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {filteredAndSortedManga.length} of {mangaArray.length} manga
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredAndSortedManga.map((manga) => (
                        <div
                            key={manga.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={manga.image_url}
                                    alt={manga.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(manga.score)} bg-white/90 backdrop-blur-sm`}>
                                        ★ {manga.score}
                                    </span>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(manga.status)}`}>
                                        {manga.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {manga.title}
                                </h3>

                                <div className="text-sm text-gray-500 mb-2">
                                    {manga.title_japanese}
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                    {manga.synopsis}
                                </p>

                                <div className="space-y-2 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                        <span>Chapters: {manga.chapters}</span>
                                        <span>Volumes: {manga.volumes}</span>
                                    </div>

                                    <div className="text-xs">
                                        Year: {new Date(manga.published_from).getFullYear()}
                                        {manga.published_to && ` - ${new Date(manga.published_to).getFullYear()}`}
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-1">
                                    {manga.genres.split(', ').slice(0, 3).map((genre, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                    {manga.genres.split(', ').length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            +{manga.genres.split(', ').length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredAndSortedManga.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No manga found</h3>
                        <p className="text-gray-600">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MangaPageClient;