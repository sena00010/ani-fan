import NakamaPage from './NakamaPage';
import type { Metadata } from 'next';
import { cache } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

interface PageProps {
  params: {
    nakamaId: string;
  };
}

interface ServerCommunity {
  id?: number | string;
  communityName?: string;
  community_name?: string;
  communitySlug?: string;
  community_slug?: string;
  communityDescription?: string;
  community_description?: string;
  communityMember?: number | string;
  member_count?: number | string;
  active_member_count?: number | string;
  communityTags?: string[];
  community_tags?: string[];
  communityRules?: string[];
  community_rules?: string[];
  communityImages?: string[];
  community_images?: string[];
  communityCoverImages?: string[];
  community_cover_images?: string[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

interface CommunityResponse {
  community?: ServerCommunity;
  message?: string;
}

const resolveImageUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

const fetchCommunity = cache(async (nakamaId: string): Promise<CommunityResponse | null> => {
  const communityIdNum = Number(nakamaId);
  if (!Number.isFinite(communityIdNum)) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/community?communityId=${communityIdNum}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
});

const buildSeoContent = (community?: ServerCommunity, nakamaId?: string) => {
  const fallbackTitle = 'Anime Community | Ani Fan';
  const fallbackDescription =
    'Discover vibrant anime communities on Ani Fan. Join discussions, share recommendations, and connect with fans worldwide. Ani Fan topluluğuna katılın, animeler hakkında sohbet edin ve yeni arkadaşlar edinin.';

  if (!community) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      images: [] as string[],
    };
  }

  const name =
    community.communityName ||
    community.community_name ||
    community.communitySlug ||
    community.community_slug ||
    `Community #${community.id ?? nakamaId ?? ''}`;
  const description =
    community.communityDescription ??
    community.community_description ??
    '';
  const trDescription =
    description ||
    'Bu toplulukta animeler hakkında sohbet edin, önerilerinizi paylaşın ve yeni arkadaşlar edinin.';
  const enDescription =
    description ||
    'Join this anime community to chat about shows, share recommendations, and meet new fans.';
  const coverImagesRaw = Array.isArray(community.communityCoverImages)
    ? community.communityCoverImages
    : Array.isArray(community.community_cover_images)
      ? community.community_cover_images
      : [];
  const coverImages = coverImagesRaw
    .map(resolveImageUrl)
    .filter((url): url is string => Boolean(url));

  return {
    title: `${name} Anime Community | Ani Fan`,
    description: `${enDescription} / ${trDescription}`,
    images: coverImages,
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const response = await fetchCommunity(params.nakamaId);
  const community = response?.community;
  const seo = buildSeoContent(community, params.nakamaId);
  const canonicalPath = `/community/${params.nakamaId}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: [
      'anime community',
      'anime forum',
      'anime discussion',
      'anime topluluğu',
      'anime forumu',
      'anime sohbet',
    ],
    alternates: {
      canonical: canonicalPath,
      languages: {
        'en-US': canonicalPath,
        'tr-TR': canonicalPath,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalPath,
      images: seo.images.map((url) => ({
        url,
        alt: seo.title,
      })),
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.images.slice(0, 1),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const response = await fetchCommunity(params.nakamaId);
  const initialCommunity = response?.community ?? null;

  return (
    <NakamaPage
      key={params.nakamaId}
      nakamaId={params.nakamaId}
      initialCommunity={initialCommunity}
    />
  );
}
