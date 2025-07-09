import React, { useState } from 'react';
import { Edit, Save, X, User, Calendar, MapPin, FileText, Heart, Camera, Settings } from 'lucide-react';

// ProfileEditModal component (yukarda yazdığımız modal)
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

// ProfileEditModal'ının düzeltilmiş versiyonu

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               userProfile,
                                                               onSave
                                                           }) => {
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
        // Z-INDEX'İ ARTIRDIK: z-50'den z-[9999]'a
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center">
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
