import {preloadGetAnimesList} from "@/lib/server/preloadData";
import {CommonCardData} from "@/lib/mangaAnimeInterface";
import AnimePageClient from "@/animes/animeClientPage";

// Anime tipini tanımla (Go modelindeki yapıya göre)
interface Anime {
    id: number;
    title: string;
    title_english?: string | null;
    title_japanese?: string | null;
    description?: string | null; // Anime'de description var
    cover_image?: string | null;
    banner_image?: string | null;
    image_url?: string | null;
    episode_count?: number | null;
    status: string;
    release_date?: string | null;
    end_date?: string | null;
    studio?: string | null;
    source?: string | null;
    genres?: string | null;
    average_score?: number | null; // Anime'de average_score var
    popularity_rank?: number | null;
    mal_id?: number | null;
    created_at: string;
    updated_at: string;
}

export default async function AnimesPage() {
    const animeData = await preloadGetAnimesList();

    // Önce veri yapısını kontrol et
    console.log("🔍 Raw anime response:", animeData);
    console.log("🔑 Keys:", Object.keys(animeData || {}));

    // Doğru field'a eriş - muhtemelen "Animes" olmalı
    let animeArray: Anime[] = [];
    if (animeData) {
        if (Array.isArray(animeData)) {
            animeArray = animeData;
        } else if (Array.isArray(animeData.Animes)) {
            animeArray = animeData.Animes;
        } else if (Array.isArray(animeData.data)) {
            animeArray = animeData.data;
        } else {
            console.warn("⚠️ Unexpected anime data structure:", animeData);
        }
    }

    console.log("✅ Processed anime array length:", animeArray.length);

    // ANIME için transformer
    const transformAnimeToCommonCard = (anime: Anime): CommonCardData => {
        return {
            id: anime.id,
            title: anime.title,
            titleEnglish: anime.title_english,
            titleJapanese: anime.title_japanese,
            description: anime.description, // Anime'de direkt description
            imageUrl: anime.image_url || anime.cover_image,
            score: anime.average_score, // Anime'de average_score
            status: anime.status,
            genres: anime.genres,

            // Anime özel alanları
            episodeCount: anime.episode_count,
            studio: anime.studio,
            releaseDate: anime.release_date,
            endDate: anime.end_date,

            // Manga alanları boş (anime'de yok)
            chapters: null,
            volumes: null,
            publishedFrom: null,
            publishedTo: null,

            type: 'anime' // TİP ANİME!
        };
    };

    if (!animeArray || animeArray.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">😔</div>
                    <p className="text-gray-600 mb-4">There is no anime.</p>
                    <a
                        href="/"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    // Transform işlemi - ÖNEMLİ KISIM!
    const transformedAnimeData: CommonCardData[] = animeArray.map(transformAnimeToCommonCard);

    return (
        <AnimePageClient
            initialData={transformedAnimeData} // Transform edilmiş veri gönder
        />
    );
}