import MangaDetailPage from './MangaDetailPage';

interface PageProps {
  params: {
    mangaId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <MangaDetailPage mangaId={params.mangaId} />;
}
