"use client"
import React, {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {toast} from "react-hot-toast";
import {motion} from "framer-motion";
import {Image as ImageIcon, Plus, Upload, X} from "lucide-react";
import {useRouter} from "next/navigation";

const CreateCommunity = () => {
    const [user, setUser] = useState<User | null>(null);
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [rules, setRules] = useState<string[]>([""]);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [backgroundImages, setBackgroundImages] = useState<File[]>([]);
    const [backgroundPreviews, setBackgroundPreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';
    const router = useRouter();

    // Get current user from Firebase Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const [file] = e.target.files;
        setProfileImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const remainingSlots = 5 - backgroundImages.length;

        if (remainingSlots === 0) {
            toast.error("Maksimum 5 arka plan fotoğrafı yükleyebilirsiniz");
            return;
        }

        const newFiles = files.slice(0, remainingSlots);
        const newImages = [...backgroundImages, ...newFiles];
        setBackgroundImages(newImages);

        // Preview oluştur
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setBackgroundImages(backgroundImages.filter((_, i) => i !== index));
        setBackgroundPreviews(backgroundPreviews.filter((_, i) => i !== index));
    };

    const handleRuleChange = (index: number, value: string) => {
        setRules(prev => prev.map((rule, i) => (i === index ? value : rule)));
    };

    const addRuleField = () => {
        setRules(prev => [...prev, ""]);
    };

    const removeRuleField = (index: number) => {
        if (rules.length === 1) {
            setRules([""]);
            return;
        }
        setRules(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!communityName.trim()) {
            toast.error("Community adı boş olamaz");
            return;
        }

        setIsLoading(true);

        try {
            if (!user?.uid) {
                toast.error("Kullanıcı kimliği bulunamadı");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('userId', user.uid);
            formData.append('communityName', communityName);
            formData.append('communityDescription', communityDescription || '');

            // Profil resmi "images" olarak gönder
            if (profileImage) {
                formData.append('images', profileImage);
            } else {
                // Resim yoksa da field'ı gönder (optional)
                console.warn('Profil resmi seçilmedi');
            }

            // Arka plan resimleri "coverImages" olarak gönder
            if (backgroundImages.length > 0) {
                backgroundImages.forEach((image) => {
                    formData.append('coverImages', image);
                });
            } else {
                console.warn('Arka plan resmi seçilmedi');
            }

            // Kuralları gönder
            const sanitizedRules = rules
                .map(rule => rule.trim())
                .filter(rule => rule.length > 0);

            if (sanitizedRules.length > 0) {
                sanitizedRules.forEach((rule) => {
                    formData.append('communityRules', rule);
                });
            }

            const response = await fetch(`${API_BASE}/create/community`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Community oluşturulamadı');
            }

            const createdCommunityId =
                data?.communityId ??
                data?.community_id ??
                data?.community?.id ??
                data?.id;

            if (!createdCommunityId) {
                throw new Error('Community ID alınamadı');
            }

            toast.success("Community başarıyla oluşturuldu! 🎉");
            router.push(`/community/${createdCommunityId}`);

            // Reset form
            setCommunityName("");
            setCommunityDescription("");
            setRules([""]);
            setProfileImage(null);
            setProfilePreview(null);
            setBackgroundImages([]);
            setBackgroundPreviews([]);

        } catch (error: any) {
            console.error('Community oluşturma hatası:', error);
            toast.error(error.message || 'Community oluşturulurken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };    return (
        <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12">
            <motion.div
                initial={{opacity: 0, y: 24}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8"
            >
                <div className="rounded-3xl border border-purple-100/60  backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
                    <div className="border-b border-purple-100/60 dark:border-gray-800 px-8 py-6 rounded-t-3xl">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Yeni Community Oluştur
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Community detaylarını doldurun, kuralları belirleyin ve profil arka plan görsellerini ekleyin.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">
                        {/* Community Name */}
                        <section className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Community Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={communityName}
                                    onChange={(e) => setCommunityName(e.target.value)}
                                    placeholder="Community adını girin"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    value={communityDescription}
                                    onChange={(e) => setCommunityDescription(e.target.value)}
                                    placeholder="Community açıklaması (isteğe bağlı)"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                        </section>

                        {/* Community Rules */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Community Kuralları</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Üyelerin uyması gereken kuralları ekleyin. Boş alanlar gönderim esnasında göz ardı edilir.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addRuleField}
                                    className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-100 dark:border-purple-800/60 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60"
                                >
                                    <Plus className="h-4 w-4" />
                                    Kural Ekle
                                </button>
                            </div>

                            <div className="space-y-3">
                                {rules.map((rule, index) => (
                                    <div key={`rule-${index}`} className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <label className="sr-only">Kural {index + 1}</label>
                                            <textarea
                                                value={rule}
                                                onChange={(e) => handleRuleChange(index, e.target.value)}
                                                placeholder={`Kural ${index + 1}`}
                                                rows={2}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeRuleField(index)}
                                            className="mt-1 rounded-full p-2 text-gray-400 transition hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/10"
                                            aria-label={`Kural ${index + 1} alanını sil`}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Profile Image */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profil Fotoğrafı</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Community profil fotoğrafı olarak tek bir görsel yükleyin.
                            </p>
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <div className="h-32 w-32 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
                                    {profilePreview ? (
                                        <img src={profilePreview} alt="Community profil önizleme" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                                            <ImageIcon className="h-10 w-10" />
                                            <span className="mt-2 text-xs text-center px-2">
                                                Fotoğraf seçilmedi
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="cursor-pointer rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-100 dark:border-purple-800/60 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60">
                                        Profil Fotoğrafı Seç
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {profileImage && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileImage(null);
                                                setProfilePreview(null);
                                            }}
                                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                                        >
                                            Fotoğrafı Kaldır
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Background Images */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Arka Plan Görselleri (Maksimum 5)
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Community arka planında kullanılacak görselleri ekleyin.
                            </p>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {backgroundPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Arka plan önizleme ${index + 1}`}
                                            className="h-32 w-full rounded-xl object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            aria-label={`Arka plan ${index + 1} görselini kaldır`}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {backgroundImages.length < 5 && (
                                    <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center transition-colors hover:border-purple-500 dark:border-gray-600">
                                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Görsel Ekle</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleBackgroundImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {backgroundImages.length === 0 && (
                                <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center transition-colors hover:border-purple-500 dark:border-gray-600">
                                    <label className="flex cursor-pointer flex-col items-center">
                                        <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Görsel eklemek için tıklayın
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleBackgroundImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}
                        </section>

                        {/* Submit Button */}
                        <div className="flex justify-end border-t border-purple-100/60 pt-6 dark:border-gray-800">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? 'Oluşturuluyor...' : 'Community Oluştur'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default CreateCommunity