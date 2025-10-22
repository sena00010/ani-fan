import NakamaPage from './NakamaPage';

interface PageProps {
  params: {
    nakamaId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <NakamaPage nakamaId={params.nakamaId} />;
}
