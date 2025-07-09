"use client";
import React, { useState } from 'react';
import {
    User,
    MapPin,
    Calendar,
    Star,
    Heart,
    MessageCircle,
    Settings,
    Edit,
    Play,
    BookOpen,
    Eye,
    Clock,
    Award,
    Users,
    TrendingUp,
    Plus,
    Save,
    X,
    Camera
} from 'lucide-react';

const AnimeProfilePage = (initialData: any) => {
    console.log(initialData,"initialData");
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editingField, setEditingField] = useState(null);
    // Sample user data - senin backend'den gelecek
    const userBackendData=initialData.initialData.user;
    console.log(initialData.initialData.user,"initialData2");

    const [userData, setUserData] = useState({
        name: userBackendData?.user_name,
        username: userBackendData?.user_nick_name,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
        bio: "Anime ve manga tutkunu 🌸 Her gün yeni bir hikaye keşfetmeyi seviyorum!",
        location: "İstanbul, Türkiye",
        joinDate: initialData?.currentUser?.metadata?.creationTime,
        birthDate: "1995-03-15",
        verified: true,
        rank: "Anime Enthusiast",
        level: 12,
        points: 1547,
        totalFollowers: 342,
        totalFollowing: 156,
        // user_detail tablosundan gelecek veriler
        favoriteGenres: ["Slice of Life", "Romance", "Comedy", "Drama"],
        favoriteCharacters: ["Violet Evergarden", "Senku Ishigami", "Tanjiro"],
        hobbies: "Anime izleme, manga okuma, çizim yapma, cosplay",
        stats: {
            animeCount: 127,
            mangaCount: 89,
            episodesWatched: 2847,
            chaptersRead: 1205,
            totalWatchTime: 23.5, // days
            meanScore: 8.2
        }
    });

    const animeList = [
        {
            id: 1,
            title: "Attack on Titan",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop",
            status: "completed",
            score: 10,
            episodes: "75/75",
            type: "TV"
        },
        {
            id: 2,
            title: "Demon Slayer",
            image: "https://images.unsplash.com/photo-1611351236491-80a8f0f1dd93?w=200&h=280&fit=crop",
            status: "watching",
            score: 9,
            episodes: "32/44",
            type: "TV"
        },
        {
            id: 3,
            title: "Your Name",
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=280&fit=crop",
            status: "completed",
            score: 10,
            episodes: "1/1",
            type: "Movie"
        }
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'watching': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'on-hold': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'dropped': return 'bg-red-50 text-red-700 border-red-200';
            case 'plan-to-watch': return 'bg-gray-50 text-gray-700 border-gray-200';
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

    const handleSave = (field: any, value: any) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
        setEditingField(null);
    };

    const EditableField = ({ field, value, type = "text", multiline = false }) => {
        const [tempValue, setTempValue] = useState(value);

        if (editingField === field) {
            return (
                <div className="flex items-center gap-2">
                    {multiline ? (
                        <textarea
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none"
                            rows={3}
                            autoFocus
                        />
                    ) : (
                        <input
                            type={type}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            autoFocus
                        />
                    )}
                    <button
                        onClick={() => handleSave(field, tempValue)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setEditingField(null)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between group">
                <span className={multiline ? "whitespace-pre-wrap" : ""}>{value}</span>
                <button
                    onClick={() => setEditingField(field)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                >
                    <Edit className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section - Sadeleştirilmiş */}
            <div className="relative bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                                <img
                                    src={userData.avatar}
                                    alt={userData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </button>
                            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg">
                                {userData.level}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    <EditableField field="name" value={userData.name} />
                                </h1>
                                {userData.verified && (
                                    <div className="bg-blue-500 rounded-full p-1">
                                        <Star className="w-5 h-5 text-white fill-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <EditableField field="location" value={userData.location} />
                </span>
                                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                                    {userData.joinDate} tarihinde katıldı
                </span>
                            </div>

                            <div className="max-w-2xl">
                                <EditableField field="bio" value={userData.bio} multiline />
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
                                    <span className="text-sm font-medium">{userData.rank}</span>
                                </div>
                                <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
                                    <span className="text-sm font-medium">{userData.points} XP</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                Mesaj
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                                <Settings className="w-5 h-5" />
                                Ayarlar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{userData.stats.animeCount}</div>
                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                <Play className="w-4 h-4" />
                                Anime İzlendi
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{userData.stats.mangaCount}</div>
                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                Manga Okundu
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{userData.totalFollowers}</div>
                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                <Users className="w-4 h-4" />
                                Takipçi
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{userData.stats.meanScore}</div>
                            <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                <Star className="w-4 h-4" />
                                Ortalama Puan
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Genel Bakış', icon: Eye },
                            { id: 'anime', label: 'Anime Listesi', icon: Play },
                            { id: 'manga', label: 'Manga Listesi', icon: BookOpen },
                            { id: 'profile', label: 'Profil Detayları', icon: User },
                            { id: 'social', label: 'Sosyal', icon: Users }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
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
                        )}

                        {activeTab === 'anime' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Anime Listesi</h2>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                                        <Plus className="w-4 h-4" />
                                        Anime Ekle
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {animeList.map((anime) => (
                                        <div key={anime.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="flex">
                                                <div className="w-24 h-32 bg-gray-200 flex-shrink-0">
                                                    <img
                                                        src={anime.image}
                                                        alt={anime.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-4 flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{anime.title}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(anime.status)}`}>
                              {anime.status === 'watching' ? 'İzliyor' :
                                  anime.status === 'completed' ? 'Tamamlandı' : anime.status}
                            </span>
                                                        <span className="text-xs text-gray-500">{anime.type}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex">
                                                            {renderStars(anime.score)}
                                                        </div>
                                                        <span className="text-sm text-gray-600">{anime.score}/10</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{anime.episodes} bölüm</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Profil Detayları</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kişisel Bilgiler */}
                                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Kişisel Bilgiler</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                                                <EditableField field="birthDate" value={userData.birthDate} type="date" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                                                <EditableField field="location" value={userData.location} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Hobilerim</label>
                                                <EditableField field="hobbies" value={userData.hobbies} multiline />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Anime Tercihleri */}
                                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Anime Tercihleri</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Favori Türler</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {userData.favoriteGenres.map((genre, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                              {genre}
                            </span>
                                                    ))}
                                                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-gray-200 transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Favori Karakterler</label>
                                                <div className="space-y-2">
                                                    {userData.favoriteCharacters.map((character, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                            <span className="text-sm">{character}</span>
                                                            <button className="text-gray-400 hover:text-red-500">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button className="w-full p-2 bg-gray-100 text-gray-600 rounded-lg border border-dashed border-gray-300 hover:bg-gray-200 transition-colors">
                                                        <Plus className="w-4 h-4 mx-auto" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Diğer tab'lar aynı şekilde... */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Currently Watching */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Şu An İzliyor</h3>
                            <div className="space-y-3">
                                {animeList.filter(anime => anime.status === 'watching').map((anime) => (
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
                                {[
                                    { name: 'İlk Anime', earned: true },
                                    { name: 'Anime Tutkunu', earned: true },
                                    { name: 'Sosyal Kelebek', earned: true }
                                ].map((achievement, index) => (
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
                </div>
            </div>
        </div>
    );
};

export default AnimeProfilePage;