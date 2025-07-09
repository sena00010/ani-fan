import React from 'react';
import { Plus, X } from 'lucide-react';
import EditableField from './EditableField';

interface ProfileDetailsTabProps {
    userData: any;
    editingField: string | null;
    setEditingField: (field: string | null) => void;
    handleSave: (field: string, value: string) => void;
}

const ProfileDetailsTab: React.FC<ProfileDetailsTabProps> = ({
                                                                 userData,
                                                                 editingField,
                                                                 setEditingField,
                                                                 handleSave
                                                             }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profil Detayları</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kişisel Bilgiler */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Kişisel Bilgiler</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                            <EditableField
                                field="birthDate"
                                value={userData.birthDate}
                                type="date"
                                editingField={editingField}
                                setEditingField={setEditingField}
                                handleSave={handleSave}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                            <EditableField
                                field="location"
                                value={userData.location}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                handleSave={handleSave}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hobilerim</label>
                            <EditableField
                                field="hobbies"
                                value={userData.hobbies}
                                multiline
                                editingField={editingField}
                                setEditingField={setEditingField}
                                handleSave={handleSave}
                            />
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
                                {userData.favoriteGenres.map((genre: string, index: number) => (
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
                                {userData.favoriteCharacters.map((character: string, index: number) => (
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
    );
};

export default ProfileDetailsTab;