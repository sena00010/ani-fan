"use client";
import { useState } from 'react';
import MangaAnimeCard from '@/components/MangaAnimeCard';
import { CommonCardData } from '@/lib/mangaAnimeInterface';

export interface MangaPageClientProps {
    initialData: CommonCardData[]; // Artık CommonCardData[] alıyor
}

const MangaPageClient: React.FC<MangaPageClientProps> = ({ initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortBy, setSortBy] = useState('score');

    const mangaArray = initialData || [];

    // Get unique genres
    const allGenres = Array.from(new Set(
        mangaArray
            .filter(manga => manga.genres)
            .flatMap(manga => manga.genres!.split(', ').map(genre => genre.trim()))
    )).sort();

    // Get unique statuses
    const allStatuses = Array.from(new Set(
        mangaArray.map(manga => manga.status)
    )).sort();

    // Filter and sort manga
    const filteredAndSortedManga = mangaArray
        .filter(manga => {
            const matchesSearch = manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (manga.titleEnglish && manga.titleEnglish.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesGenre = selectedGenre === 'All' || (manga.genres && manga.genres.includes(selectedGenre));
            const matchesStatus = selectedStatus === 'All' || manga.status === selectedStatus;

            return matchesSearch && matchesGenre && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return (b.score || 0) - (a.score || 0);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'chapters':
                    return (b.chapters || 0) - (a.chapters || 0);
                case 'year':
                    if (!a.publishedFrom && !b.publishedFrom) return 0;
                    if (!a.publishedFrom) return 1;
                    if (!b.publishedFrom) return -1;
                    return new Date(b.publishedFrom).getFullYear() - new Date(a.publishedFrom).getFullYear();
                default:
                    return 0;
            }
        });

    const handleMangaClick = (manga: CommonCardData) => {
        console.log('Manga clicked:', manga);
        // Manga detay sayfasına yönlendirme
        const mangaSlug = manga.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        window.location.href = `/mangas/${mangaSlug}`;
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

                {/* Ortak Component Kullanımı */}
                {filteredAndSortedManga.length > 0 ? (
                    <MangaAnimeCard
                        data={filteredAndSortedManga}
                        onCardClick={handleMangaClick}
                    />
                ) : (
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