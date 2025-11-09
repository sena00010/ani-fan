"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Camera, Video, Music, ChevronUp, Palette, Moon, Sun, Plus, Bookmark, Star, Users, Hash } from 'lucide-react';
import CreateCommunityModal from '@/components/modals/CreateCommunityModal';
import { useQueryClient } from '@tanstack/react-query';
import PostFeed from './components/PostFeed';
import CommunitySidebar from './components/CommunitySidebar';
import BannerOverlay from './components/BannerOverlay';
import BannerCarousel from './components/BannerCarousel';
import ThemeElements from './components/ThemeElements';
import PostCreationForm from './components/PostCreationForm';
import { POPULAR_ANIME_TAGS, POPULAR_MANGA_TAGS } from './constants/popularTags';
import type { AnimePost, Comment, PopularItem, CommunityTab } from './types';

// Backend API base
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

// Initial empty list; will be populated from backend
const samplePosts: AnimePost[] = [];

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
  const [activeTab, setActiveTab] = useState<CommunityTab>('all');
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
        
        // Fetch like status for each post from /post/likes endpoint
        if (user?.uid) {
          const likedSet = new Set<string>();
          const likeStatusPromises = uniquePosts.map(async (p: any) => {
            try {
              const postId = String(p.id);
              const res = await fetch(`${API_BASE}/post/likes?postId=${postId}&userId=${encodeURIComponent(user.uid)}`);
              if (!res.ok) return { postId, isLiked: false };
              const data = await res.json();
              return { postId, isLiked: data.isAuthUserInList === true };
            } catch (error) {
              console.error(`Error fetching like status for post ${p.id}:`, error);
              return { postId: String(p.id), isLiked: false };
            }
          });
          
          const likeStatuses = await Promise.all(likeStatusPromises);
          likeStatuses.forEach(({ postId, isLiked }) => {
            if (isLiked) {
              likedSet.add(postId);
            }
          });
          
          // Update likedPosts state
          if (offset === 0) {
            setLikedPosts(likedSet);
          } else {
            setLikedPosts(prev => {
              const newSet = new Set(prev);
              likeStatuses.forEach(({ postId, isLiked }) => {
                if (isLiked) {
                  newSet.add(postId);
                } else {
                  newSet.delete(postId);
                }
              });
              return newSet;
            });
          }
        } else {
          // If no user, seed liked set from server response if available
          const likedSet = new Set<string>();
          postsArr.forEach((p: any) => { if (p.isLiked) likedSet.add(String(p.id)); });
          if (likedSet.size) setLikedPosts(likedSet);
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, user?.uid]);

  // Popular anime/manga tags
  const popularAnimeTags = POPULAR_ANIME_TAGS;

  const popularMangaTags = POPULAR_MANGA_TAGS;

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
    if (!user?.uid) return;
    
    const isLiked = likedPosts.has(postId);
    // Store previous state for potential revert
    const previousLikeCount = posts.find(p => p.id === postId)?.reactions.likes ?? 0;
    
    // optimistic UI update
    setPosts(prevPosts => prevPosts.map(post => post.id === postId ? {
      ...post,
      reactions: { ...post.reactions, likes: isLiked ? post.reactions.likes - 1 : post.reactions.likes + 1 }
    } : post));
    setLikedPosts(prev => {
      const ns = new Set(prev);
      if (isLiked) ns.delete(postId); else ns.add(postId);
      return ns;
    });
    
    try {
      // Use /post/like endpoint for both like and unlike operations
      const response = await fetch(`${API_BASE}/post/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: Number(postId), 
          userId: String(user.uid) 
        })
      });
      
      if (!response.ok) {
        // Revert optimistic update on error
        setPosts(prevPosts => prevPosts.map(post => post.id === postId ? {
          ...post,
          reactions: { ...post.reactions, likes: previousLikeCount }
        } : post));
        setLikedPosts(prev => {
          const ns = new Set(prev);
          if (isLiked) ns.add(postId); else ns.delete(postId);
          return ns;
        });
        return;
      }
      
      // Fetch updated like status from /post/likes endpoint to sync with backend
      try {
        const likesResponse = await fetch(`${API_BASE}/post/likes?postId=${postId}&userId=${encodeURIComponent(user.uid)}`);
        if (likesResponse.ok) {
          const likesData = await likesResponse.json();
          const isUserLiked = likesData.isAuthUserInList === true;
          
          // Update likedPosts state based on backend response
          setLikedPosts(prev => {
            const ns = new Set(prev);
            if (isUserLiked) {
              ns.add(postId);
            } else {
              ns.delete(postId);
            }
            return ns;
          });
          
          // Update like count from backend if available
          if (likesData.totalCount !== undefined) {
            setPosts(prevPosts => prevPosts.map(post => post.id === postId ? {
              ...post,
              reactions: { ...post.reactions, likes: likesData.totalCount ?? post.reactions.likes }
            } : post));
          }
        }
      } catch (likesError) {
        console.error('Like durumu güncellenirken hata:', likesError);
      }
    } catch (error) {
      // Revert optimistic update on error
      setPosts(prevPosts => prevPosts.map(post => post.id === postId ? {
        ...post,
        reactions: { ...post.reactions, likes: previousLikeCount }
      } : post));
      setLikedPosts(prev => {
        const ns = new Set(prev);
        if (isLiked) ns.add(postId); else ns.delete(postId);
        return ns;
      });
      console.error('Like işlemi sırasında hata:', error);
    }
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

  return (
    <div className={`${getThemeBackground()} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <ThemeElements theme={theme} />
      </div>

      <div className="relative z-10">
        {/* Dynamic Banner Section */}
        <div className="relative h-96 overflow-hidden">
          <BannerCarousel banners={bannerImages} activeIndex={currentBannerIndex} />

          {/* Banner Content Overlay */}
          <BannerOverlay subtitle={bannerImages[currentBannerIndex].subtitle} />

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
                    onClick={() => setActiveTab(id as CommunityTab)}
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
          <CommunitySidebar
            theme={theme}
            colors={colors}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            popularAnime={popularAnime}
          />

          {/* Main Content */}
          <div className="flex-1 w-full lg:max-w-4xl">
          {/* Create Post Section */}
          <PostCreationForm
            user={user}
            theme={theme}
            colors={colors}
            newPost={newPost}
            onChangePost={(value) => setNewPost(value)}
            onSubmit={handleCreatePost}
            showTagSelection={showCreatePost}
            onToggleTagSelection={() => setShowCreatePost((prev) => !prev)}
            selectedAnimeTags={selectedAnimeTags}
            selectedMangaTags={selectedMangaTags}
            onToggleTag={toggleTag}
            popularAnimeTags={popularAnimeTags}
            popularMangaTags={popularMangaTags}
            textareaRef={textareaRef}
          />
            
          <PostFeed
            filteredPosts={filteredPosts}
            theme={theme}
            colors={colors}
            bookmarkedPosts={bookmarkedPosts}
            likedPosts={likedPosts}
            expandedComments={expandedComments}
            expandedReplies={expandedReplies}
            showReplyBox={showReplyBox}
            newComment={newComment}
            newReply={newReply}
            user={user}
            commentInputRefs={commentInputRefs}
            handleBookmark={handleBookmark}
            handleLike={handleLike}
            toggleComments={toggleComments}
            toggleReplies={toggleReplies}
            toggleReplyBox={toggleReplyBox}
            handleAddComment={handleAddComment}
            handleAddReply={handleAddReply}
            setNewComment={setNewComment}
            setNewReply={setNewReply}
          />

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
