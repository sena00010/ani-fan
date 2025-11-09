export interface NakamaCommunity {
  id: string;
  name: string;
  description: string;
  banner: string;
  avatar: string;
  creator: {
    name: string;
    avatar: string;
    level: number;
  };
  members: number;
  activeMembers: number;
  createdAt: string;
  tags: string[];
  rules: string[];
  isJoined: boolean;
  isAdmin: boolean;
  isCreator: boolean;
}

export interface NakamaMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  role: 'creator' | 'admin' | 'member';
  joinedAt: string;
  isOnline: boolean;
  currentAnime?: string;
  currentManga?: string;
  favoriteGenre: string;
}

export interface NakamaActivity {
  id: string;
  type: 'watching' | 'reading' | 'review' | 'discussion' | 'milestone';
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  anime?: {
    title: string;
    image: string;
    episode: number;
    totalEpisodes?: number;
  };
  manga?: {
    title: string;
    image: string;
    chapter: number;
    totalChapters?: number;
  };
  timestamp: string;
  reactions: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
}

