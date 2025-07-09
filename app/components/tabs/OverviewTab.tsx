import React from 'react';

interface OverviewTabProps {
    userData: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userData }) => {
    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">İstatistikler</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-2xl font-bold text-blue-600">{userData.stats.episodesWatched}</div>
                        <div className="text-sm text-gray-600">Bölüm İzlendi</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-600">{userData.stats.chaptersRead}</div>
                        <div className="text-sm text-gray-600">Bölüm Okundu</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="text-2xl font-bold text-purple-600">{userData.stats.totalWatchTime}</div>
                        <div className="text-sm text-gray-600">Gün İzledi</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h3>
                <div className="space-y-4">
                    {[
                        { type: 'completed', title: 'Attack on Titan', action: 'tamamladı', time: '2 saat önce' },
                        { type: 'watching', title: 'Demon Slayer', action: 'izlemeye başladı', time: '1 gün önce' },
                        { type: 'scored', title: 'Your Name', action: 'puanladı (10/10)', time: '3 gün önce' }
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-12 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                {activity.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900">
                                    <span className="font-medium">{activity.title}</span> {activity.action}
                                </p>
                                <p className="text-sm text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;