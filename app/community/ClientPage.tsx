"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, Share2, Bookmark, Star, Sparkles, Zap, Users, TrendingUp, Camera, Image, Video, Music, Hash, Smile, ChevronUp } from 'lucide-react';

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

// Sample data for demonstration
const samplePosts: AnimePost[] = [
  {
    id: '1',
    author: {
      name: 'SakuraFan2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      level: 15,
      favoriteAnime: 'Naruto'
    },
    content: 'Just finished watching Attack on Titan Season 4! The animation quality is absolutely incredible! 🔥 What did you all think about the final season?',
    animeTags: ['Attack on Titan', 'Shingeki no Kyojin'],
    mangaTags: [],
    reactions: { likes: 42, comments: 8, shares: 3 },
    timestamp: '2 hours ago',
    type: 'text',
    comments: [
      {
        id: 'c1',
        author: {
          name: 'AnimeLover99',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          level: 12
        },
        content: 'The final season was absolutely mind-blowing! The animation quality was top-notch! 🔥',
        timestamp: '1 hour ago',
        replies: [
          {
            id: 'r1',
            author: {
              name: 'SakuraFan2024',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              level: 15
            },
            content: 'Right?! I was on the edge of my seat the entire time! 😱',
            timestamp: '45 minutes ago',
            replies: [],
            reactions: { likes: 3 }
          }
        ],
        reactions: { likes: 5 }
      },
      {
        id: 'c2',
        author: {
          name: 'MangaReader',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          level: 18
        },
        content: 'I read the manga first, but the anime adaptation exceeded all my expectations!',
        timestamp: '30 minutes ago',
        replies: [],
        reactions: { likes: 2 }
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'AnimeMaster',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      level: 23,
      favoriteAnime: 'One Piece'
    },
    content: 'My top 5 anime recommendations for beginners! These shows will definitely get you hooked on anime! ✨',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=300&fit=crop'
    ],
    animeTags: ['Demon Slayer', 'My Hero Academia', 'Spirited Away'],
    mangaTags: ['One Piece', 'Naruto'],
    reactions: { likes: 89, comments: 15, shares: 12 },
    timestamp: '4 hours ago',
    type: 'image',
    comments: []
  },
  {
    id: '3',
    author: {
      name: 'MangaReader',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      level: 18,
      favoriteAnime: 'Studio Ghibli'
    },
    content: 'Just read the latest chapter of Jujutsu Kaisen! The art style is getting even more amazing! 🎨',
    animeTags: ['Jujutsu Kaisen'],
    mangaTags: ['Jujutsu Kaisen'],
    reactions: { likes: 67, comments: 22, shares: 5 },
    timestamp: '6 hours ago',
    type: 'text',
    comments: []
  },
  {
    id: '4',
    author: {
      name: 'OtakuLife',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      level: 31,
      favoriteAnime: 'Fullmetal Alchemist'
    },
    content: 'Check out this amazing anime recommendation!',
    animeTags: ['Demon Slayer'],
    mangaTags: [],
    reactions: { likes: 156, comments: 28, shares: 19 },
    timestamp: '1 day ago',
    type: 'recommendation',
    animeRecommendation: {
      title: 'Demon Slayer: Kimetsu no Yaiba',
      image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=400&fit=crop',
      score: 9.2,
      status: 'Completed'
    },
    comments: []
  },
  {
    id: '5',
    author: {
      name: 'System',
      avatar: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop&crop=face',
      level: 99,
      favoriteAnime: 'All Anime'
    },
    content: '🎉 Yeni Anime Güncellemesi!',
    animeTags: ['One Piece'],
    mangaTags: [],
    reactions: { likes: 234, comments: 45, shares: 67 },
    timestamp: '30 minutes ago',
    type: 'auto-update',
    autoUpdateData: {
      title: 'One Piece - Yeni Bölüm Yayında!',
      description: 'One Piece\'in yeni bölümü yayınlandı! Luffy\'nin macerası devam ediyor. Hemen izlemek için tıklayın!',
      link: '/animes',
      category: 'anime'
    },
    comments: []
  },
  {
    id: '6',
    author: {
      name: 'NakamaChat',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      level: 50,
      favoriteAnime: 'One Piece'
    },
    content: '🏴‍☠️ One Piece Nakama Sohbeti - Bugünkü konu: En sevdiğiniz arc hangisi?',
    animeTags: ['One Piece'],
    mangaTags: [],
    reactions: { likes: 89, comments: 156, shares: 23 },
    timestamp: '1 hour ago',
    type: 'nakama',
    isNakama: true,
    nakamaMembers: 47,
    comments: [
      {
        id: 'nc1',
        author: {
          name: 'LuffyFan',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          level: 25
        },
        content: 'Enies Lobby arc\'ı beni çok etkiledi! Robin\'in hikayesi çok duygusalydı 😭',
        timestamp: '45 minutes ago',
        replies: [
          {
            id: 'nr1',
            author: {
              name: 'ZoroLover',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
              level: 22
            },
            content: 'Aynen! "I want to live!" sahnesi unutulmaz! 🔥',
            timestamp: '30 minutes ago',
            replies: [],
            reactions: { likes: 8 }
          }
        ],
        reactions: { likes: 12 }
      }
    ]
  }
];

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
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
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!newPost.trim() || !user) return;

    const post: AnimePost = {
      id: Date.now().toString(),
      author: {
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1,
        favoriteAnime: 'Anime Lover'
      },
      content: newPost,
      animeTags: selectedAnimeTags,
      mangaTags: selectedMangaTags,
      reactions: { likes: 0, comments: 0, shares: 0 },
      timestamp: 'Just now',
      type: 'text',
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedAnimeTags([]);
    setSelectedMangaTags([]);
    setShowCreatePost(false);
  };

  const handleAddComment = (postId: string) => {
    if (!newComment[postId]?.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1
      },
      content: newComment[postId],
      timestamp: 'Just now',
      replies: [],
      reactions: { likes: 0 }
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
          reactions: {
            ...post.reactions,
            comments: post.reactions.comments + 1
          }
        };
      }
      return post;
    }));

    setNewComment(prev => ({ ...prev, [postId]: '' }));
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
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = likedPosts.has(postId);
        return {
          ...post,
          reactions: {
            ...post.reactions,
            likes: isLiked ? post.reactions.likes - 1 : post.reactions.likes + 1
          }
        };
      }
      return post;
    }));

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating anime elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌸</div>
        <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🎌</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
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
          <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-white font-bold text-lg mb-1">
                {bannerImages[currentBannerIndex].title}
              </div>
              <div className="text-gray-300 text-sm">
                Şu an popüler
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-6">Kategoriler</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
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
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
          {/* Create Post Section */}
          {user && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-purple-400"
                />
                <div>
                  <div className="text-white font-semibold">{user.displayName || 'Anonymous'}</div>
                  <div className="text-gray-400 text-sm">Share your anime thoughts!</div>
                </div>
              </div>
              
              <textarea
                ref={textareaRef}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind about anime? Share your thoughts, reviews, or recommendations! ✨"
                className="w-full bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
              
              {/* Tag Selection */}
              {showCreatePost && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-white font-semibold mb-2 block">Anime Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {popularAnimeTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, 'anime')}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedAnimeTags.includes(tag)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white font-semibold mb-2 block">Manga Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {popularMangaTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, 'manga')}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedMangaTags.includes(tag)
                              ? 'bg-green-500 text-white'
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
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all"
                  >
                    <Hash className="w-4 h-4" />
                    Add Tags
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all">
                    <Image className="w-4 h-4" />
                    Image
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all">
                    <Smile className="w-4 h-4" />
                    Emoji
                  </button>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
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
                      <h3 className="text-white font-semibold">{post.author.name}</h3>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{post.timestamp}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
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
                  <p className="text-white text-lg leading-relaxed">{post.content}</p>
                  
                  {/* Auto Update Card */}
                  {post.type === 'auto-update' && post.autoUpdateData && (
                    <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg">{post.autoUpdateData.title}</h4>
                          <p className="text-gray-300 text-sm">{post.autoUpdateData.description}</p>
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
                            <h4 className="text-white font-semibold text-lg">Nakama Sohbeti</h4>
                            <p className="text-gray-300 text-sm">{post.nakamaMembers} aktif üye</p>
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
                          <h4 className="text-white font-semibold text-lg">{post.animeRecommendation.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white font-semibold">{post.animeRecommendation.score}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300">{post.animeRecommendation.status}</span>
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
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* Add Comment */}
                    {user && (
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border border-purple-400"
                          />
                          <span className="text-white font-semibold">{user.displayName || 'Anonymous'}</span>
                        </div>
                        <div className="flex gap-3">
                          <textarea
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Yorumunuzu yazın..."
                            className="flex-1 bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      </div>
                    )}

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
                              <span className="text-white font-semibold">{comment.author.name}</span>
                              <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                                Lv.{comment.author.level}
                              </span>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-white mb-3">{comment.content}</p>
                          
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
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                Load More Posts ✨
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
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 z-50 flex items-center justify-center group"
        >
          <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default CommunityPage;
