"use client";
import React, { useState } from 'react';
import {
    User,
    MapPin,
    Calendar,
    Star,
    MessageCircle,
    Settings,
    Play,
    BookOpen,
    Eye,
    Users,
    Camera,
    Save,
    X,
    FileText,
    Heart
} from 'lucide-react';
import OverviewTab from "@/components/tabs/OverviewTab";
import AnimeListTab from "@/components/tabs/AnimeListTab";
import MangaListTab from "@/components/tabs/MangaListTab";
import ProfileDetailsTab from "@/components/tabs/ProfileDetailsTab";
import SocialTab from "@/components/tabs/SocialTab";
import toast from 'react-hot-toast';
import userService from "@/services/userService";

// ProfileEditModal component
interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: {
        user_name: string;
        user_surname: string;
        user_nick_name: string;
        bio: string;
        birth_date: string | null;
        location: string;
        hobbies: string;
        profile_image: string;
    };
    onSave: (updatedProfile: any) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               userProfile,
                                                               onSave
                                                           }) => {
    console.log(userProfile,"userProfile");
    const [formData, setFormData] = useState({
        user_name: userProfile.user_name || '',
        user_surname: userProfile.user_surname || '',
        user_nick_name: userProfile.user_nick_name || '',
        bio: userProfile.bio || '',
        birth_date: userProfile.birth_date || '',
        location: userProfile.location || '',
        hobbies: userProfile.hobbies || '',
        profile_image: userProfile.profile_image || ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600" />
                        Profili Düzenle
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">

                    {/* Profil Fotoğrafı */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {formData.profile_image ? (
                                    <img
                                        src={formData.profile_image}
                                        alt="Profil"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    formData.user_name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Profil fotoğrafını değiştir</p>
                    </div>

                    {/* İsim ve Soyisim */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                İsim
                            </label>
                            <input
                                type="text"
                                value={formData.user_name}
                                onChange={(e) => handleInputChange('user_name', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="İsminizi girin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Soyisim
                            </label>
                            <input
                                type="text"
                                value={formData.user_surname}
                                onChange={(e) => handleInputChange('user_surname', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Soyisminizi girin"
                            />
                        </div>
                    </div>

                    {/* Kullanıcı Adı */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            value={formData.user_nick_name}
                            onChange={(e) => handleInputChange('user_nick_name', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Kullanıcı adınızı girin"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Kendinizden bahsedin..."
                            maxLength={300}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.bio.length}/300 karakter
                        </p>
                    </div>

                    {/* Doğum Tarihi ve Konum */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Doğum Tarihi
                            </label>
                            <input
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Konum
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Şehir, Ülke"
                            />
                        </div>
                    </div>

                    {/* Hobiler */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Hobiler
                        </label>
                        <textarea
                            value={formData.hobbies}
                            onChange={(e) => handleInputChange('hobbies', e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Anime izlemek, manga okumak, oyun oynamak..."
                        />
                    </div>

                    {/* Profil Fotoğraf URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Profil Fotoğraf URL
                        </label>
                        <input
                            type="url"
                            value={formData.profile_image}
                            onChange={(e) => handleInputChange('profile_image', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="https://example.com/profil-foto.jpg"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sidebar component (geçici olarak burada tanımlayalım)
const Sidebar = ({ userData }: { userData: any }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Favori Türler</h3>
            <div className="flex flex-wrap gap-2">
                {userData.favoriteGenres?.map((genre: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {genre}
                    </span>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Favori Karakterler</h3>
            <div className="space-y-3">
                {userData.favoriteCharacters?.map((character: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-700">{character}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Ana AnimeProfilePage component
const AnimeProfilePage = (initialData: any) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const userBackendData = initialData.initialData?.user;
    const currentUserId = userBackendData.id; // Bunu prop olarak almak gerekecek

    const [userData, setUserData] = useState({
        user_id: userBackendData.id,
        name: userBackendData?.user_name || '',
        surname: userBackendData?.user_surname || '',
        username: userBackendData?.user_nick_name || '',
        avatar: userBackendData?.profile_image || "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
        bio: userBackendData?.bio || "Anime ve manga tutkunu 🌸 Her gün yeni bir hikaye keşfetmeyi seviyorum!",
        location: userBackendData?.location || "İstanbul, Türkiye",
        joinDate: userBackendData?.member_since || initialData?.currentUser?.metadata?.creationTime,
        birthDate: userBackendData?.birth_date || "1995-03-15",
        hobbies: userBackendData?.hobbies || "Anime izleme, manga okuma, çizim yapma, cosplay",
        verified: true,
        rank: "Anime Enthusiast",
        level: 12,
        points: 1547,
        totalFollowers: 342,
        totalFollowing: 156,
        favoriteGenres: ["Slice of Life", "Romance", "Comedy", "Drama"],
        favoriteCharacters: ["Violet Evergarden", "Senku Ishigami", "Tanjiro"],
        stats: {
            animeCount: userBackendData?.anime_count || 127,
            mangaCount: userBackendData?.manga_count || 89,
            episodesWatched: 2847,
            chaptersRead: 1205,
            totalWatchTime: userBackendData?.total_watch_time ? Math.floor(userBackendData.total_watch_time / 60) : 23.5,
            meanScore: 8.2
        }
    });

    // Profil güncelleme fonksiyonu
    const handleProfileUpdate = async (updatedData: any) => {
        if (!currentUserId) {
            toast.error('Kullanıcı ID bulunamadı');
            return;
        }

        try {
            await userService.updateUserProfile(currentUserId, updatedData);

            // Local state'i güncelle
            setUserData(prev => ({
                ...prev,
                name: updatedData.user_name,
                surname: updatedData.user_surname,
                username: updatedData.user_nick_name,
                bio: updatedData.bio,
                location: updatedData.location,
                birthDate: updatedData.birth_date,
                hobbies: updatedData.hobbies,
                avatar: updatedData.profile_image
            }));

            toast.success('Profil başarıyla güncellendi!');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            toast.error('Profil güncellenirken bir hata oluştu');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Genel Bakış', icon: Eye },
        { id: 'anime', label: 'Anime Listesi', icon: Play },
        { id: 'manga', label: 'Manga Listesi', icon: BookOpen },
        { id: 'profile', label: 'Profil Detayları', icon: User },
        { id: 'social', label: 'Sosyal', icon: Users }
    ];

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return <OverviewTab userData={userData} />;
            case 'anime':
                return <AnimeListTab userData={userData} />;
            case 'manga':
                return <MangaListTab userData={userData} />;
            case 'profile':
                return <ProfileDetailsTab userData={userData} editingField={null}
                                          setEditingField={function (field: string | null): void {
                                              throw new Error('Function not implemented.');
                                          }} handleSave={function (field: string, value: string): void {
                    throw new Error('Function not implemented.');
                }} />;
            case 'social':
                return <SocialTab userData={userData} />;
            default:
                return <OverviewTab userData={userData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
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
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                            >
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
                                    {userData.name} {userData.surname}
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
                                    {userData.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('tr-TR') : ''} tarihinde katıldı
                                </span>
                            </div>

                            <div className="max-w-2xl">
                                <p className="text-gray-700">{userData.bio}</p>
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
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                Profili Düzenle
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
                            <div className="text-sm text-gray-500 flex items-center gap-1 justify-center">
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
                        {tabs.map((tab) => {
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
                        {renderTabContent()}
                    </div>

                    {/* Sidebar */}
                    <Sidebar userData={userData} />
                </div>
            </div>

            {/* Profile Edit Modal */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userProfile={{
                    user_id:userData.user_id,
                    user_name: userData.name,
                    user_surname: userData.surname,
                    user_nick_name: userData.username,
                    bio: userData.bio,
                    birth_date: userData.birthDate,
                    location: userData.location,
                    hobbies: userData.hobbies,
                    profile_image: userData.avatar
                }}
                onSave={handleProfileUpdate}
            />
        </div>
    );
};

export default AnimeProfilePage;