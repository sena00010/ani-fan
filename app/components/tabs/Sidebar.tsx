import React from 'react';
import { Award } from 'lucide-react';

interface SidebarProps {
    userData: any;
}

const Sidebar: React.FC<SidebarProps> = ({ userData }) => {
    const currentlyWatching = [
        {
            id: 2,
            title: "Demon Slayer",
            image: "https://images.unsplash.com/photo-1611351236491-80a8f0f1dd93?w=200&h=280&fit=crop",
            episodes: "32/44"
        }
    ];

    const achievements = [
        { name: 'İlk Anime', earned: true },
        { name: 'Anime Tutkunu', earned: true },
        { name: 'Sosyal Kelebek', earned: true }
    ];

    return (
        <div className="space-y-6">
            {/* Currently Watching */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Şu An İzliyor</h3>
                <div className="space-y-3">
                    {currentlyWatching.map((anime) => (
                        <div key={anime.id} className="flex items-center gap-3">
                            <div className="w-12 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                                <img
                                    src={anime.image}
                                    alt={anime.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{anime.title}</h4>
                                <p className="text-sm text-gray-500">{anime.episodes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hızlı İstatistikler</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Toplam İzlenen:</span>
                        <span className="font-medium">{userData.stats.animeCount} anime</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Toplam Süre:</span>
                        <span className="font-medium">{userData.stats.totalWatchTime} gün</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Ortalama Puan:</span>
                        <span className="font-medium">{userData.stats.meanScore}/10</span>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Son Başarımlar</h3>
                <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${achievement.earned ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-amber-400 text-amber-900' : 'bg-gray-300 text-gray-500'}`}>
                                <Award className="w-4 h-4" />
                            </div>
                            <span className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                                {achievement.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;