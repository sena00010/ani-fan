import AnimeDetailPage from './AnimeDetailPage';

interface PageProps {
  params: {
    animeId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <AnimeDetailPage animeId={params.animeId} />;
}
