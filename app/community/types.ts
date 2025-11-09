export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: string;
  replies: Comment[];
  reactions: {
    likes: number;
  };
}

export interface AnimePost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    favoriteAnime: string;
  };
  content: string;
  images?: string[];
  animeTags: string[];
  mangaTags: string[];
  reactions: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'review' | 'recommendation' | 'auto-update' | 'nakama';
  animeRecommendation?: {
    title: string;
    image: string;
    score: number;
    status: string;
  };
  comments: Comment[];
  isNakama?: boolean;
  nakamaMembers?: number;
  autoUpdateData?: {
    title: string;
    description: string;
    link: string;
    category: 'anime' | 'manga' | 'news';
  };
}

export type CommunityTab = 'all' | 'anime' | 'manga' | 'reviews' | 'nakama';

export interface PopularItem {
  id: string;
  title: string;
  image: string;
  type: 'anime' | 'manga';
  score: number;
  views: number;
  genres: string[];
  status: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
  hover: string;
}

