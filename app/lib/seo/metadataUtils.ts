import type { Metadata } from "next";

interface SeoSettingsData {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  author?: string;
  copyright?: string;
}

interface SeoSettings {
  status: boolean;
  message?: string;
  data?: SeoSettingsData;
}

export default function generateMeta(
  seoSettings: SeoSettings | null
): Metadata {
  const defaultMetadata: Metadata = {
    title: "Animepression",
    description: "Animepression",
    keywords: "Animepression, platform",
    authors: [{ name: "Animepression" }],
    robots: "index, follow",
    openGraph: {
      title: "Animepression",
      description: "Animepression",
      type: "website",
      url: "https://animepression.net",
    },
    twitter: {
      card: "summary_large_image",
      site: "@Animepression",
      creator: "@Animepression",
      title: "Animepression",
      description: "Animepression",
    },
    alternates: {
      canonical: "https://Animepression.net",
    },
  };

  if (seoSettings?.data) {
    const data = seoSettings.data;
    const metadata: Metadata = {
      title: data.title || (defaultMetadata.title as string),
      description: data.description || (defaultMetadata.description as string),
      keywords: data.keywords,
      authors: [{ name: data.author || "Animepression Team" }],
      robots: "index, follow",
      openGraph: {
        title: data.title || (defaultMetadata.title as string),
        description:
          data.description || (defaultMetadata.description as string),
        type: "website",
        url: data.canonical || "https://Animepression.net",
      },
      twitter: {
        card: "summary_large_image",
        site: "@Animepression",
        creator: data.author || "Animepression Team",
        title: data.title || (defaultMetadata.title as string),
        description:
          data.description || (defaultMetadata.description as string),
      },
      alternates: {
        canonical: data.canonical,
      },
    };

    return metadata;
  }

  return defaultMetadata;
}
