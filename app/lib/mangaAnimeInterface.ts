// types/commonCard.ts
export interface CommonCardData {
    id: number;
    title: string;
    titleEnglish?: string | null;
    titleJapanese?: string | null;
    description?: string | null; // Anime'de description, Manga'da synopsis
    imageUrl?: string | null;
    score?: number | null;
    status: string;
    genres?: string | null;

    // Anime için özel alanlar
    episodeCount?: number | null;
    studio?: string | null;
    releaseDate?: string | null;
    endDate?: string | null;

    // Manga için özel alanlar
    chapters?: number | null;
    volumes?: number | null;
    publishedFrom?: string | null;
    publishedTo?: string | null;

    // Card tipini belirlemek için
    type: 'anime' | 'manga';
}