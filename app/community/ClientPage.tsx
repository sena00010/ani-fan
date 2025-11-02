"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Heart, MessageCircle, Share2, Bookmark, Star, Sparkles, Zap, Users, TrendingUp, Camera, Image, Video, Music, Hash, Smile, ChevronUp, Palette, Moon, Sun, Plus } from 'lucide-react';
import CreateCommunityModal from '@/components/modals/CreateCommunityModal';
import { useQueryClient } from '@tanstack/react-query';

// Backend API base
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

// Comment interface
interface Comment {
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

// Anime-themed post interface
interface AnimePost {
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

// Initial empty list; will be populated from backend
const samplePosts: AnimePost[] = [];

// Popular Anime/Manga Interface
interface PopularItem {
  id: string;
  title: string;
  image: string;
  type: 'anime' | 'manga';
  score: number;
  views: number;
  genres: string[];
  status: string;
}

// Sample Popular Data
const popularAnime: PopularItem[] = [
  {
    id: '1',
    title: 'One Piece',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=150&h=200&fit=crop',
    type: 'anime',
    score: 9.2,
    views: 2500000,
    genres: ['Action', 'Adventure'],
    status: 'Ongoing'
  },
  {
    id: '2',
    title: 'Attack on Titan',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop',
    type: 'anime',
    score: 9.0,
    views: 2000000,
    genres: ['Action', 'Drama'],
    status: 'Completed'
  },
  {
    id: '3',
    title: 'Demon Slayer',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=200&fit=crop',
    type: 'anime',
    score: 8.8,
    views: 1800000,
    genres: ['Action', 'Supernatural'],
    status: 'Completed'
  },
  {
    id: '4',
    title: 'Jujutsu Kaisen',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=200&fit=crop',
    type: 'anime',
    score: 8.9,
    views: 1600000,
    genres: ['Action', 'Supernatural'],
    status: 'Ongoing'
  },
  {
    id: '5',
    title: 'My Hero Academia',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=200&fit=crop',
    type: 'anime',
    score: 8.7,
    views: 1400000,
    genres: ['Action', 'School'],
    status: 'Ongoing'
  }
];

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  console.log(user,"useruseruser")
  const { theme, setTheme, colors } = useTheme();
  const queryClient = useQueryClient();
  const [posts, setPosts] = useState<AnimePost[]>(samplePosts);
  const [newPost, setNewPost] = useState('');
  const [selectedAnimeTags, setSelectedAnimeTags] = useState<string[]>([]);
  const [selectedMangaTags, setSelectedMangaTags] = useState<string[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'anime' | 'manga' | 'reviews' | 'nakama'>('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{[postId: string]: string}>({});
  const [newReply, setNewReply] = useState<{[commentId: string]: string}>({});
  const [showReplyBox, setShowReplyBox] = useState<{[commentId: string]: boolean}>({});
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentInputRefs = useRef<{[postId: string]: HTMLTextAreaElement | null}>({});

  // Dynamic banner images
  const bannerImages = [
    {
      url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1200&h=400&fit=crop',
      title: 'One Piece',
      subtitle: 'Luffy\'nin macerası devam ediyor!'
    },
    {
      url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&h=400&fit=crop',
      title: 'Attack on Titan',
      subtitle: 'Son sezon ile büyük final!'
    },
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
      title: 'Demon Slayer',
      subtitle: 'Nezuko\'nun hikayesi!'
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop',
      title: 'My Hero Academia',
      subtitle: 'Hero\'ların yeni nesli!'
    },
    {
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=400&fit=crop',
      title: 'Naruto',
      subtitle: 'Ninja dünyasının efsanesi!'
    },
    {
      url: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=1200&h=400&fit=crop',
      title: 'Dragon Ball Z',
      subtitle: 'Goku\'nun efsanevi savaşları!'
    },
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
      title: 'Jujutsu Kaisen',
      subtitle: 'Yuji\'nin lanetli dünyası!'
    },
    {
      url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&h=400&fit=crop',
      title: 'Tokyo Ghoul',
      subtitle: 'Kaneko\'nun karanlık hikayesi!'
    }
  ];

  // Auto-rotate banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Yorumlar açıldığında input alanına focus yap
  useEffect(() => {
    expandedComments.forEach((postId) => {
      setTimeout(() => {
        const inputRef = commentInputRefs.current[postId];
        if (inputRef) {
          inputRef.focus();
        }
      }, 300);
    });
  }, [expandedComments]);

  // Fetch main feed posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/posts?userId=${user ? encodeURIComponent(user.uid) : ''}&limit=${limit}&offset=${offset}`);
        if (!res.ok) return;
        const data = await res.json();
        const postsArr = Array.isArray(data.posts) ? data.posts : [];
        // Filter unique posts by ID to avoid duplicates
        const uniquePostsMap = new Map<number, any>();
        postsArr.forEach((p: any) => {
          if (p.id && !uniquePostsMap.has(p.id)) {
            uniquePostsMap.set(p.id, p);
          }
        });
        const uniquePosts = Array.from(uniquePostsMap.values());
        
        const mapped: AnimePost[] = uniquePosts.map((p: any) => ({
          id: String(p.id),
          author: {
            name: p.username || 'User',
            avatar: p.userAvatar?.Valid && p.userAvatar.String 
              ? `${API_BASE}/${p.userAvatar.String}` 
              : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            level: p.userLevel || 1,
            favoriteAnime: p.favoriteAnime?.Valid ? p.favoriteAnime.String : 'Anime Lover',
          },
          content: p.postContent || p.postTitle || '',
          images: p.postImages?.Valid && p.postImages.String ? [p.postImages.String] : undefined,
          animeTags: [],
          mangaTags: [],
          reactions: {
            likes: p.likeCount ?? 0,
            comments: p.commentCount ?? 0,
            shares: 0,
          },
          timestamp: p.createdAt || 'now',
          type: 'text',
          comments: [],
          isNakama: p.communityId && p.communityId > 0,
        }));
        setPosts(prev => offset === 0 ? mapped : [...prev, ...mapped]);
        // Seed liked set from server, if available
        const likedSet = new Set<string>();
        postsArr.forEach((p: any) => { if (p.isLiked) likedSet.add(String(p.id)); });
        if (likedSet.size) setLikedPosts(likedSet);
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, user?.uid]);

  // Popular anime/manga tags
  const popularAnimeTags = [
    'Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'One Piece', 'Naruto',
    'Dragon Ball', 'Jujutsu Kaisen', 'Tokyo Ghoul', 'Death Note', 'Fullmetal Alchemist',
    'Spirited Away', 'Your Name', 'Studio Ghibli', 'Bleach', 'Hunter x Hunter'
  ];

  const popularMangaTags = [
    'One Piece', 'Naruto', 'Attack on Titan', 'Demon Slayer', 'My Hero Academia',
    'Jujutsu Kaisen', 'Tokyo Ghoul', 'Death Note', 'Dragon Ball', 'Bleach',
    'Hunter x Hunter', 'Fullmetal Alchemist', 'Black Clover', 'Fairy Tail', 'Sword Art Online'
  ];

  const handleCreatePost = () => {
    // Backend post creation requires communityId and postTitle; UI lacks these.
    // Keep local-only creation disabled for now.
    if (!newPost.trim() || !user) return;
    setNewPost('');
    setSelectedAnimeTags([]);
    setSelectedMangaTags([]);
    setShowCreatePost(false);
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]?.trim() || !user) return;
    
    const commentContent = newComment[postId].trim();
    if (!commentContent) return;
    
    try {
      const form = new FormData();
      form.append('postId', String(Number(postId) || postId));
      form.append('userId', String(user.uid));
      form.append('commentContent', commentContent);
      form.append('commentGifs', '[]'); // JSON array string olarak boş array
      
      const res = await fetch(`${API_BASE}/comment/create`, { 
        method: 'POST', 
        body: form 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Yorum oluşturulamadı:', res.status, errorText);
        return;
      }
      
      const data = await res.json();
      const commentID = data.commentId;
      
      if (!commentID) {
        console.error('Yorum ID alınamadı');
        return;
      }
      
      // Backend'den başarılı response aldık, yorumu ekle
      const comment: Comment = {
        id: String(commentID),
        author: {
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          level: Math.floor(Math.random() * 50) + 1
        },
        content: commentContent,
        timestamp: 'Şimdi',
        replies: [],
        reactions: { likes: 0 }
      };
      
      setPosts(posts.map(post => post.id === postId ? {
        ...post,
        comments: [...post.comments, comment],
        reactions: { ...post.reactions, comments: post.reactions.comments + 1 }
      } : post));
      
      // Input alanını temizle
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      
      // Yorum başarıyla eklendi mesajı (opsiyonel)
      console.log('Yorum başarıyla eklendi:', commentID);
    } catch (error) {
      console.error('Yorum gönderilirken hata oluştu:', error);
    }
  };

  const handleAddReply = (postId: string, commentId: string) => {
    if (!newReply[commentId]?.trim() || !user) return;

    const reply: Comment = {
      id: Date.now().toString(),
      author: {
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1
      },
      content: newReply[commentId],
      timestamp: 'Just now',
      replies: [],
      reactions: { likes: 0 }
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, reply]
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));

    setNewReply(prev => ({ ...prev, [commentId]: '' }));
    setShowReplyBox(prev => ({ ...prev, [commentId]: false }));
  };

  const toggleComments = (postId: string) => {
    let willOpen = false;
    
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      willOpen = !newSet.has(postId);
      
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      
      return newSet;
    });
    
    // Yorumlar açılıyorsa backend'den fetch et ve input'a focus yap
    if (willOpen) {
      const post = posts.find(p => p.id === postId);
      if (post && post.comments.length === 0) {
        fetchCommentsForPost(postId);
      }
      
      // Input alanına focus yap
      setTimeout(() => {
        const inputRef = commentInputRefs.current[postId];
        if (inputRef) {
          inputRef.focus();
          // Input alanına scroll yap
          inputRef.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 200);
    }
  };

  const fetchCommentsForPost = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE}/post/comments?postId=${postId}`);
      if (!res.ok) {
        console.error('Yorumlar getirilemedi:', res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      const commentsArr = Array.isArray(data.comments) ? data.comments : [];
      
      console.log('Backend\'den gelen yorumlar:', commentsArr);
      
      // Timestamp formatlamak için helper fonksiyon
      const formatTimestamp = (dateString: string) => {
        if (!dateString) return 'now';
        try {
          const date = new Date(dateString);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          if (diffMins < 1) return 'Şimdi';
          if (diffMins < 60) return `${diffMins} dakika önce`;
          if (diffHours < 24) return `${diffHours} saat önce`;
          if (diffDays < 7) return `${diffDays} gün önce`;
          return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        } catch {
          return dateString;
        }
      };

      const mappedComments: Comment[] = commentsArr.map((c: any) => {
        // Avatar URL'ini oluştur
        let avatarUrl = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
        if (c.userAvatar?.Valid && c.userAvatar.String && c.userAvatar.String !== 'null') {
          if (c.userAvatar.String === 'default.jpg') {
            avatarUrl = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
          } else {
            avatarUrl = `${API_BASE}/${c.userAvatar.String}`;
          }
        }

        return {
          id: String(c.id),
          author: {
            name: c.username || 'User',
            avatar: avatarUrl,
            level: c.userLevel || 1,
          },
          content: c.commentContent || '',
          timestamp: formatTimestamp(c.createdAt),
          replies: [], // Backend'den reply gelmiyorsa boş array
          reactions: { likes: 0 } // Backend'den like count gelmiyorsa 0
        };
      });
      
      console.log('Map edilmiş yorumlar:', mappedComments);
      
      // Yorumları post'a ekle - functional update kullan
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: mappedComments }
          : post
      ));
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const toggleReplyBox = (commentId: string) => {
    setShowReplyBox(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    // optimistic UI
    setPosts(posts.map(post => post.id === postId ? {
      ...post,
      reactions: { ...post.reactions, likes: isLiked ? post.reactions.likes - 1 : post.reactions.likes + 1 }
    } : post));
    setLikedPosts(prev => {
      const ns = new Set(prev);
      if (isLiked) ns.delete(postId); else ns.add(postId);
      return ns;
    });
    try {
      const endpoint = isLiked ? '/post/unlike' : '/post/like';
      await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: Number(postId) || postId, userId: Number(user?.uid) || user?.uid })
      });
    } catch (_) {}
  };

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleTag = (tag: string, type: 'anime' | 'manga') => {
    if (type === 'anime') {
      setSelectedAnimeTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    } else {
      setSelectedMangaTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    }
  };

  const filteredPosts = posts.filter(post => {
    switch (activeTab) {
      case 'anime':
        return post.animeTags.length > 0;
      case 'manga':
        return post.mangaTags.length > 0;
      case 'reviews':
        return post.type === 'review' || post.type === 'recommendation';
      case 'nakama':
        return post.type === 'nakama' || post.isNakama;
      default:
        return true;
    }
  });

  const getThemeBackground = () => {
    switch (theme) {
      case 'purple':
        return 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
      case 'dark':
        return 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';
      case 'light':
        return 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50';
      default:
        return 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
    }
  };

  const getThemeElements = () => {
    switch (theme) {
      case 'purple':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌸</div>
            <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🎌</div>
            <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
          </>
        );
      case 'dark':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/10 via-gray-700/10 to-gray-800/10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌙</div>
            <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🌑</div>
            <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
          </>
        );
      case 'light':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-100/20 via-yellow-100/15 to-amber-150/20" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/25 to-yellow-300/25 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/25 to-amber-400/25 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">☀️</div>
            <div className="absolute top-40 right-20 text-4xl opacity-25 animate-float-reverse">🌟</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-22 animate-float">🌤️</div>
            <div className="absolute bottom-20 right-10 text-3xl opacity-30 animate-float-reverse">✨</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${getThemeBackground()} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {getThemeElements()}
      </div>

      <div className="relative z-10">
        {/* Dynamic Banner Section */}
        <div className="relative h-96 overflow-hidden">
          <div className="relative w-full h-full">
            {bannerImages.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            ))}
          </div>
          

          {/* Banner Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4 animate-title-gradient">
                AnimeConnect Community
              </h1>
              <p className="text-2xl text-gray-200 mb-6">
                {bannerImages[currentBannerIndex].subtitle}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">2.4K Aktif Üye</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">156 Günlük Post</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">89 Yeni Üye</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBannerIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Featured Anime Title */}
          <div className={`absolute top-8 right-8 backdrop-blur-md rounded-2xl p-4 border ${
            theme === 'light'
              ? 'bg-white/95 border-gray-300/80 shadow-lg'
              : 'bg-white/10 border-white/20'
          }`}>
            <div className="text-center">
              <div className={`font-bold text-lg mb-1 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {bannerImages[currentBannerIndex].title}
              </div>
              <div className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Şu an popüler
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile Categories */}
          <div className="lg:hidden mb-6">
            <div className={`${colors.surface} backdrop-blur-md rounded-3xl p-4 border ${colors.border}`}>
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All', icon: Hash },
                  { id: 'anime', label: 'Anime', icon: Video },
                  { id: 'manga', label: 'Manga', icon: Bookmark },
                  { id: 'reviews', label: 'Reviews', icon: Star },
                  { id: 'nakama', label: 'Nakama', icon: Users }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      activeTab === id
                        ? theme === 'light' 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : `${colors.textSecondary} ${colors.hover}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className={`${colors.surface} backdrop-blur-md rounded-3xl p-6 border ${colors.border}`}>
              <h3 className={`${colors.text} font-bold text-xl mb-6`}>Kategoriler</h3>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'All Posts', icon: Hash },
                  { id: 'anime', label: 'Anime', icon: Video },
                  { id: 'manga', label: 'Manga', icon: Bookmark },
                  { id: 'reviews', label: 'Reviews', icon: Star },
                  { id: 'nakama', label: 'Nakama', icon: Users }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                      activeTab === id
                        ? theme === 'light' 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : `${colors.textSecondary} ${colors.hover}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Section - Right below Categories */}
            <div className={`${colors.surface} backdrop-blur-md rounded-3xl p-6 border ${colors.border} shadow-xl mt-6`}>
              <h3 className={`${colors.text} font-bold text-xl mb-6`}>Popüler Bu Hafta</h3>
              
              {/* Popular Anime List */}
              <div className="space-y-4">
                {popularAnime.map((item, index) => (
                  <div key={item.id} className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group ${
                    theme === 'light'
                      ? 'hover:bg-amber-50/60'
                      : 'hover:bg-white/10'
                  }`}>
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                      />
                      <div className={`absolute -top-2 -right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`${colors.text} font-semibold text-sm mb-1 truncate`}>
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < Math.floor(item.score) ? 'text-yellow-400 fill-current' : 'text-gray-400'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className={`${colors.textSecondary} text-xs`}>
                          {item.score}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.genres.slice(0, 2).map((genre) => (
                          <span 
                            key={genre}
                            className={`px-2 py-1 text-xs rounded-full border ${
                              theme === 'light'
                                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 border-amber-400/30'
                                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30'
                            }`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${colors.textSecondary} text-xs`}>
                          {item.views.toLocaleString()} görüntüleme
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Ongoing' 
                            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More Button */}
              <button className={`w-full mt-6 py-3 rounded-2xl ${
                theme === 'light' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold hover:from-amber-600 hover:to-yellow-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600'
              } transition-all duration-300 shadow-lg hover:shadow-xl`}>
                Daha Fazla Gör
              </button>

              {/* Trending Tags */}
              <div className="mt-8">
                <h4 className={`${colors.text} font-semibold text-lg mb-4`}>Trend Etiketler</h4>
                <div className="flex flex-wrap gap-2">
                  {['#OnePiece', '#AttackOnTitan', '#DemonSlayer', '#JujutsuKaisen', '#MyHeroAcademia', '#Naruto'].map((tag) => (
                    <span 
                      key={tag}
                      className={`px-3 py-1 text-sm rounded-full border transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 border-amber-400/30 hover:from-amber-500/30 hover:to-yellow-500/30'
                          : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full lg:max-w-4xl">
          {/* Create Post Section */}
          {user && (
            <div className={`backdrop-blur-md rounded-3xl p-6 mb-8 border ${
              theme === 'light'
                ? 'bg-white/95 border-gray-300/80 shadow-lg'
                : 'bg-white/10 border-white/20'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-purple-400"
                />
                <div>
                  <div className={`font-semibold ${colors.text}`}>{user.displayName || 'Anonymous'}</div>
                  <div className={`text-sm ${colors.textSecondary}`}>Share your anime thoughts!</div>
                </div>
              </div>
              
              <textarea
                ref={textareaRef}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind about anime? Share your thoughts, reviews, or recommendations! ✨"
                className={`w-full rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:border-transparent ${
                  theme === 'light'
                    ? 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-amber-500'
                    : 'bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-purple-500'
                }`}
                rows={3}
              />
              
              {/* Tag Selection */}
              {showCreatePost && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className={`font-semibold mb-2 block ${colors.text}`}>Anime Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {popularAnimeTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, 'anime')}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedAnimeTags.includes(tag)
                              ? 'bg-blue-500 text-white'
                              : theme === 'light'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className={`font-semibold mb-2 block ${colors.text}`}>Manga Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {popularMangaTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, 'manga')}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedMangaTags.includes(tag)
                              ? 'bg-green-500 text-white'
                              : theme === 'light'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      theme === 'light'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Hash className="w-4 h-4" />
                    Add Tags
                  </button>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    theme === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
                  }`}>
                    <Image className="w-4 h-4" />
                    Image
                  </button>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    theme === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
                  }`}>
                    <Smile className="w-4 h-4" />
                    Emoji
                  </button>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className={`px-6 py-2 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  Post ✨
                </button>
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`backdrop-blur-md rounded-3xl p-6 border transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white/95 border-gray-300/80 hover:bg-white shadow-lg'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-14 h-14 rounded-full border-2 border-purple-400"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Lv.{post.author.level}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${colors.text}`}>{post.author.name}</h3>
                      <span className={`text-sm ${colors.textSecondary}`}>•</span>
                      <span className={`text-sm ${colors.textSecondary}`}>{post.timestamp}</span>
                    </div>
                    <div className={`text-sm ${colors.textSecondary}`}>
                      Favorite: {post.author.favoriteAnime}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`p-2 rounded-xl transition-all ${
                      bookmarkedPosts.has(post.id)
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-yellow-400'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className={`text-lg leading-relaxed ${colors.text}`}>{post.content}</p>
                  
                  {/* Auto Update Card */}
                  {post.type === 'auto-update' && post.autoUpdateData && (
                    <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-semibold text-lg ${colors.text}`}>{post.autoUpdateData.title}</h4>
                          <p className={`text-sm ${colors.textSecondary}`}>{post.autoUpdateData.description}</p>
                        </div>
                      </div>
                      <a
                        href={post.autoUpdateData.link}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                      >
                        {post.autoUpdateData.category === 'anime' ? 'Animeyi İzle' : 
                         post.autoUpdateData.category === 'manga' ? 'Mangayı Oku' : 'Haberi Oku'}
                        <span className="text-lg">→</span>
                      </a>
                    </div>
                  )}

                  {/* Nakama Chat Card */}
                  {post.type === 'nakama' && (
                    <a href={`/community/${post.id}`} className="block">
                      <div className="mt-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-400/30 hover:from-orange-500/30 hover:to-red-500/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className={`font-semibold text-lg ${colors.text}`}>Nakama Sohbeti</h4>
                            <p className={`text-sm ${colors.textSecondary}`}>{post.nakamaMembers} aktif üye</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-orange-300">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm">Canlı sohbet - Hemen katıl!</span>
                        </div>
                      </div>
                    </a>
                  )}
                  
                  {/* Anime Recommendation Card */}
                  {post.animeRecommendation && (
                    <div className="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-400/30">
                      <div className="flex gap-4">
                        <img
                          src={post.animeRecommendation.image}
                          alt={post.animeRecommendation.title}
                          className="w-20 h-28 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className={`font-semibold text-lg ${colors.text}`}>{post.animeRecommendation.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className={`font-semibold ${colors.text}`}>{post.animeRecommendation.score}</span>
                            </div>
                            <span className={colors.textSecondary}>•</span>
                            <span className={colors.textSecondary}>{post.animeRecommendation.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.animeTags.map(tag => (
                    <a
                      key={tag}
                      href={`/animes/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30 hover:bg-blue-500/30 transition-all cursor-pointer"
                    >
                      📺 {tag}
                    </a>
                  ))}
                  {post.mangaTags.map(tag => (
                    <a
                      key={tag}
                      href={`/mangas/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-400/30 hover:bg-green-500/30 transition-all cursor-pointer"
                    >
                      📖 {tag}
                    </a>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      likedPosts.has(post.id)
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.reactions.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-blue-400 rounded-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.reactions.comments}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-green-400 rounded-xl transition-all">
                    <Share2 className="w-5 h-5" />
                    <span>{post.reactions.shares}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-300">
                    {/* Add Comment */}
                    <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
                      {user ? (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}
                              alt="Profile"
                              className="w-8 h-8 rounded-full border border-purple-400"
                            />
                            <span className={`font-semibold ${colors.text}`}>{user.displayName || 'Anonymous'}</span>
                          </div>
                          <div className="flex gap-3">
                            <textarea
                              ref={(el) => { commentInputRefs.current[post.id] = el; }}
                              value={newComment[post.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Yorumunuzu yazın..."
                              className={`flex-1 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 transition-all duration-200 ${
                                theme === 'light'
                                  ? 'bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-amber-500 focus:border-amber-500 shadow-sm'
                                  : 'bg-white/10 border-2 border-white/30 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 shadow-lg'
                              }`}
                              rows={2}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
                            >
                              Gönder
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className={`text-center p-4 rounded-xl ${theme === 'light' ? 'bg-amber-50 border border-amber-300' : 'bg-white/10 border border-white/20'}`}>
                          <p className={`${colors.text} mb-2`}>Yorum yapmak için giriş yapmalısınız</p>
                          <textarea
                            ref={(el) => { commentInputRefs.current[post.id] = el; }}
                            value={newComment[post.id] || ''}
                            disabled
                            placeholder="Giriş yapın..."
                            className={`w-full rounded-xl p-3 resize-none opacity-50 cursor-not-allowed ${
                              theme === 'light'
                                ? 'bg-gray-100 border-2 border-gray-300 text-gray-900'
                                : 'bg-white/5 border-2 border-white/20 text-white'
                            }`}
                            rows={2}
                          />
                        </div>
                      )}
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              className="w-8 h-8 rounded-full border border-purple-400"
                            />
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${colors.text}`}>{comment.author.name}</span>
                              <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                                Lv.{comment.author.level}
                              </span>
                              <span className={`text-sm ${colors.textSecondary}`}>•</span>
                              <span className={`text-sm ${colors.textSecondary}`}>{comment.timestamp}</span>
                            </div>
                          </div>
                          <p className={`mb-3 ${colors.text}`}>{comment.content}</p>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-all">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{comment.reactions.likes}</span>
                            </button>
                            <button 
                              onClick={() => toggleReplyBox(comment.id)}
                              className="text-gray-400 hover:text-blue-400 transition-all text-sm"
                            >
                              Yanıtla
                            </button>
                            {comment.replies.length > 0 && (
                              <button 
                                onClick={() => toggleReplies(comment.id)}
                                className="text-gray-400 hover:text-white transition-all text-sm"
                              >
                                {expandedReplies.has(comment.id) ? 'Yanıtları Gizle' : `${comment.replies.length} Yanıt`}
                              </button>
                            )}
                          </div>

                          {/* Reply Box */}
                          {showReplyBox[comment.id] && user && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex items-center gap-3 mb-3">
                                <img
                                  src={user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}
                                  alt="Profile"
                                  className="w-6 h-6 rounded-full border border-purple-400"
                                />
                                <span className="text-white font-semibold text-sm">{user.displayName || 'Anonymous'}</span>
                              </div>
                              <div className="flex gap-3">
                                <textarea
                                  value={newReply[comment.id] || ''}
                                  onChange={(e) => setNewReply(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                  placeholder="Yanıtınızı yazın..."
                                  className="flex-1 bg-white/5 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                  rows={2}
                                />
                                <button
                                  onClick={() => handleAddReply(post.id, comment.id)}
                                  disabled={!newReply[comment.id]?.trim()}
                                  className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end text-sm"
                                >
                                  Yanıtla
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="bg-white/5 rounded-lg p-3 ml-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <img
                                      src={reply.author.avatar}
                                      alt={reply.author.name}
                                      className="w-6 h-6 rounded-full border border-purple-400"
                                    />
                                    <span className="text-white font-semibold text-sm">{reply.author.name}</span>
                                    <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                                      Lv.{reply.author.level}
                                    </span>
                                    <span className="text-gray-400 text-xs">•</span>
                                    <span className="text-gray-400 text-xs">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-white text-sm">{reply.content}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-all">
                                      <Heart className="w-3 h-3" />
                                      <span className="text-xs">{reply.reactions.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button onClick={() => setOffset(prev => prev + limit)} disabled={isLoading} className={`px-8 py-3 text-white rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}>
                {isLoading ? 'Yükleniyor...' : 'Daha Fazla Gönderi ✨'}
              </button>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center group ${
            theme === 'light'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Create Community Floating Button */}
      <button
        onClick={() => setShowCreateCommunityModal(true)}
        className={`fixed bottom-8 left-8 px-6 py-4 text-white rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center gap-2 group hover:scale-105 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-sm md:text-base">Create Community</span>
      </button>

      {/* Create Community Modal */}
      <CreateCommunityModal
        isOpen={showCreateCommunityModal}
        onClose={() => setShowCreateCommunityModal(false)}
        onSuccess={() => {
          // Community created successfully, refetch posts
          setOffset(0);
          // Invalidate any community-related queries if they exist
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.invalidateQueries({ queryKey: ['communities'] });
        }}
      />
    </div>
  );
};

export default CommunityPage;
