import { Metadata } from "next";
// import { preloadSeoSettings } from "@/lib/server/preloadData";
import generateMeta from "@/lib/seo/metadataUtils";

export async function generateMetadata(): Promise<Metadata> {
    // const seoSettings = await preloadSeoSettings("profile", "");
    // return generateMeta(seoSettings);
}

export default function ProfileLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
