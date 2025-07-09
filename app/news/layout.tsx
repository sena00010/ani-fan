import type { Metadata } from "next";
import { preloadSeoSettings } from "@/lib/server/preloadData";
import generateMeta from "@/lib/seo/metadataUtils";

export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = await preloadSeoSettings("news", "");
  return generateMeta(seoSettings);
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
