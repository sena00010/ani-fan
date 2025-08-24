import {preloadGetMangasList} from "@/lib/server/preloadData";
import MangaPageClient from "@/mangas/mangaClientPage";


export default async function MangasPage() {
    const mangaList = await preloadGetMangasList();
    console.log(mangaList,"mangaList")
    if (!mangaList) {
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

    return (
        <MangaPageClient
            initialData={mangaList}
        />
    );
}