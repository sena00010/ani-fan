import {preloadGetMangasList} from "@/lib/server/preloadData";
import MangaPageClient from "@/mangas/mangaClientPage";
import {CommonCardData} from "@/lib/mangaAnimeInterface";

// Manga tipini tanımla (Go modelindeki yapıya göre)
interface Manga {
    id: number;
    title: string;
    title_english?: string | null;
    title_japanese?: string | null;
    synopsis?: string | null; // Manga'da synopsis var
    image_url?: string | null;
    score?: number | null; // Manga'da score var
    status: string;
    genres?: string | null;
    chapters?: number | null;
    volumes?: number | null;
    published_from?: string | null;
    published_to?: string | null;
}

export default async function MangasPage() {
    const mangaData = await preloadGetMangasList();

    console.log("🔍 Raw manga response:", mangaData);
    console.log("🔑 Keys:", Object.keys(mangaData || {}));

    // Doğru field'a eriş - muhtemelen "Mangas" olmalı
    let mangaArray: Manga[] = [];
    if (mangaData) {
        if (Array.isArray(mangaData)) {
            mangaArray = mangaData;
        } else if (Array.isArray(mangaData.Mangas)) {
            mangaArray = mangaData.Mangas;
        } else if (Array.isArray(mangaData.data)) {
            mangaArray = mangaData.data;
        } else {
            console.warn("⚠️ Unexpected manga data structure:", mangaData);
        }
    }

    console.log("✅ Processed manga array length:", mangaArray.length);

    // MANGA için transformer (anime değil!)
    const transformMangaToCommonCard = (manga: Manga): CommonCardData => {
        return {
            id: manga.id,
            title: manga.title,
            titleEnglish: manga.title_english,
            titleJapanese: manga.title_japanese,
            description: manga.synopsis, // synopsis -> description'a mapping
            imageUrl: manga.image_url,
            score: manga.score, // direkt score
            status: manga.status,
            genres: manga.genres,

            // Manga özel alanları
            chapters: manga.chapters,
            volumes: manga.volumes,
            publishedFrom: manga.published_from,
            publishedTo: manga.published_to,

            // Anime alanları boş (manga'da yok)
            episodeCount: null,
            studio: null,
            releaseDate: null,
            endDate: null,

            type: 'manga' // TİP MANGA!
        };
    };

    if (!mangaArray || mangaArray.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">😔</div>
                    <p className="text-gray-600 mb-4">There is no manga.</p>
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

    const transformedMangaData: CommonCardData[] = mangaArray.map(transformMangaToCommonCard);

    return (
        <MangaPageClient
            initialData={transformedMangaData} // Transform edilmiş veri gönder
        />
    );
}