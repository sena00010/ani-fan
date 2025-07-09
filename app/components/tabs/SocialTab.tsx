import React from 'react';
import { Users, MessageCircle, Heart, UserPlus } from 'lucide-react';

interface SocialTabProps {
    userData: any;
}

const SocialTab: React.FC<SocialTabProps> = ({ userData }) => {
    const followers = [
        {
            id: 1,
            name: "Ayşe Yılmaz",
            username: "ayse_anime",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face",
            isFollowingBack: true
        },
        {
            id: 2,
            name: "Mehmet Kaya",
            username: "mehmet_otaku",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
            isFollowingBack: false
        },
        {
            id: 3,
            name: "Zeynep Demir",
            username: "zeynep_manga",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
            isFollowingBack: true
        }
    ];

    const recentActivities = [
        {
            id: 1,
            user: "Ayşe Yılmaz",
            action: "senin Attack on Titan listendeki puanını beğendi",
            time: "2 saat önce",
            type: "like"
        },
        {
            id: 2,
            user: "Mehmet Kaya",
            action: "seni takip etmeye başladı",
            time: "1 gün önce",
            type: "follow"
        },
        {
            id: 3,
            user: "Zeynep Demir",
            action: "profiline yorum yaptı",
            time: "2 gün önce",
            type: "comment"
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sosyal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Takipçiler */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Takipçiler</h3>
                        <span className="text-sm text-gray-500">{userData.totalFollowers} kişi</span>
                    </div>
                    <div className="space-y-3">
                        {followers.map((follower) => (
                            <div key={follower.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={follower.avatar}
                                        alt={follower.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{follower.name}</h4>
                                        <p className="text-sm text-gray-500">@{follower.username}</p>
                                    </div>
                                </div>
                                <button className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    follower.isFollowingBack
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}>
                                    {follower.isFollowingBack ? 'Takip Ediliyor' : 'Takip Et'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Tümünü Gör
                    </button>
                </div>

                {/* Takip Edilenler */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Takip Edilenler</h3>
                        <span className="text-sm text-gray-500">{userData.totalFollowing} kişi</span>
                    </div>
                    <div className="space-y-3">
                        {followers.slice(0, 3).map((following) => (
                            <div key={following.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={following.avatar}
                                        alt={following.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{following.name}</h4>
                                        <p className="text-sm text-gray-500">@{following.username}</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                                    Takibi Bırak
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Tümünü Gör
                    </button>
                </div>
            </div>

            {/* Son Aktiviteler */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Son Sosyal Aktiviteler</h3>
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.type === 'like' ? 'bg-red-100' :
                                    activity.type === 'follow' ? 'bg-blue-100' :
                                        'bg-green-100'
                            }`}>
                                {activity.type === 'like' && <Heart className="w-4 h-4 text-red-600" />}
                                {activity.type === 'follow' && <UserPlus className="w-4 h-4 text-blue-600" />}
                                {activity.type === 'comment' && <MessageCircle className="w-4 h-4 text-green-600" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">
                                    <span className="font-medium">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sosyal İstatistikler */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sosyal İstatistikler</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{userData.totalFollowers}</div>
                        <div className="text-sm text-gray-600">Takipçi</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600">{userData.totalFollowing}</div>
                        <div className="text-sm text-gray-600">Takip</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">47</div>
                        <div className="text-sm text-gray-600">Beğeni</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <div className="text-2xl font-bold text-amber-600">23</div>
                        <div className="text-sm text-gray-600">Yorum</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialTab;