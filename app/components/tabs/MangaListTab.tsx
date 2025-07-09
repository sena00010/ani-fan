import React from 'react';
import { Plus, Star } from 'lucide-react';

interface MangaListTabProps {
    userData: any;
}

const MangaListTab: React.FC<MangaListTabProps> = ({ userData }) => {
    const mangaList = [
        {
            id: 1,
            title: "One Piece",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop",
            status: "reading",
            score: 9,
            chapters: "1089/1089+",
            type: "Manga"
        },
        {
            id: 2,
            title: "Demon Slayer",
            image: "https://images.unsplash.com/photo-1611351236491-80a8f0f1dd93?w=200&h=280&fit=crop",
            status: "completed",
            score: 10,
            chapters: "205/205",
            type: "Manga"
        },
        {
            id: 3,
            title: "Attack on Titan",
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=280&fit=crop",
            status: "completed",
            score: 10,
            chapters: "139/139",
            type: "Manga"
        }
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'reading': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'on-hold': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'dropped': return 'bg-red-50 text-red-700 border-red-200';
            case 'plan-to-read': return 'bg-gray-50 text-gray-700 border-gray-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const renderStars = (score: number) => {
        const stars = [];
        const fullStars = Math.floor(score / 2);
        const hasHalfStar = score % 2 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />);
        }

        if (hasHalfStar) {
            stars.push(<Star key="half" className="w-4 h-4 text-amber-400 fill-amber-400" />);
        }

        const emptyStars = 5 - Math.ceil(score / 2);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manga Listesi</h2>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Manga Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mangaList.map((manga) => (
                    <div key={manga.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex">
                            <div className="w-24 h-32 bg-gray-200 flex-shrink-0">
                                <img
                                    src={manga.image}
                                    alt={manga.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">{manga.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(manga.status)}`}>
                                        {manga.status === 'reading' ? 'Okuyor' :
                                            manga.status === 'completed' ? 'Tamamlandı' :
                                                manga.status === 'plan-to-read' ? 'Okunacak' : manga.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{manga.type}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {renderStars(manga.score)}
                                    </div>
                                    <span className="text-sm text-gray-600">{manga.score}/10</span>
                                </div>
                                <p className="text-sm text-gray-500">{manga.chapters} bölüm</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MangaListTab;