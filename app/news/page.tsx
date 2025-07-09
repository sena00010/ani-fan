import { preloadTopProducts } from "@/lib/server/preloadData";
import NewsClient from "@/news/components/NewsClient";

export default async function NewsPage() {
    const topProducts = await preloadTopProducts(8);

    return <NewsClient initialTopNews={topProducts} />;
}