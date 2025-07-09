import type { Metadata } from "next";
import { preloadSeoSettings } from "@/lib/server/preloadData";
import generateMeta from "@/lib/seo/metadataUtils";

interface Props {
  params: { news_slug_url: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seoSettings = await preloadSeoSettings("news-detail", params.news_slug_url);
  return generateMeta(seoSettings);
}

export default function NewsDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
