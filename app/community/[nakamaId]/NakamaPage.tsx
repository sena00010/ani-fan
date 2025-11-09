"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCommunityDate } from '@/lib/helper';
import JoinNakamaModal from './components/JoinNakamaModal';
import type { AnimePost, Comment } from '../types';
import type { NakamaActivity, NakamaCommunity, NakamaMember } from './types';
import NakamaBanner from './components/NakamaBanner';
import NakamaContent from './components/NakamaContent';
import { POPULAR_ANIME_TAGS, POPULAR_MANGA_TAGS } from '../constants/popularTags';

// Backend API base
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

// Sample Data
interface PrefetchedCommunity {
  id?: number | string;
  communityName?: string;
  community_name?: string;
  communitySlug?: string;
  community_slug?: string;
  communityDescription?: string;
  community_description?: string;
  communityMember?: number | string;
  member_count?: number | string;
  active_member_count?: number | string;
  communityTags?: string[];
  community_tags?: string[];
  communityRules?: string[];
  community_rules?: string[];
  communityImages?: string[];
  community_images?: string[];
  communityCoverImages?: string[];
  community_cover_images?: string[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

const sampleNakama: NakamaCommunity = {
  id: '',
  name: 'Community',
  description: '',
  banner: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1200&h=400&fit=crop',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  creator: {
    name: 'Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 1
  },
  members: 0,
  activeMembers: 0,
  createdAt: '—',
  tags: [],
  rules: [],
  isJoined: false,
  isAdmin: false,
  isCreator: false
};

const sampleMembers: NakamaMember[] = [
  {
    id: '1',
    name: 'LuffyFan2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 45,
    role: 'creator',
    joinedAt: '2 months ago',
    isOnline: true,
    currentAnime: 'One Piece',
    favoriteGenre: 'Adventure'
  },
  {
    id: '2',
    name: 'ZoroLover',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    level: 32,
    role: 'admin',
    joinedAt: '1 month ago',
    isOnline: true,
    currentAnime: 'One Piece',
    currentManga: 'One Piece',
    favoriteGenre: 'Action'
  },
  {
    id: '3',
    name: 'NamiFan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    level: 28,
    role: 'member',
    joinedAt: '3 weeks ago',
    isOnline: false,
    currentAnime: 'One Piece',
    favoriteGenre: 'Adventure'
  }
];

const sampleActivities: NakamaActivity[] = [
  {
    id: '1',
    type: 'watching',
    author: {
      name: 'LuffyFan2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      level: 45
    },
    content: 'One Piece 1095. bölümü izliyorum! Bu arc gerçekten harika! 🔥',
    anime: {
      title: 'One Piece',
      image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=400&fit=crop',
      episode: 1095,
      totalEpisodes: 1100
    },
    timestamp: '2 hours ago',
    reactions: { likes: 23, comments: 5 },
    isLiked: false
  },
  {
    id: '2',
    type: 'reading',
    author: {
      name: 'ZoroLover',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      level: 32
    },
    content: 'One Piece 1095. bölümü okudum! Zoro\'nun yeni gücü inanılmaz! ⚔️',
    manga: {
      title: 'One Piece',
      image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=400&fit=crop',
      chapter: 1095,
      totalChapters: 1100
    },
    timestamp: '4 hours ago',
    reactions: { likes: 18, comments: 3 },
    isLiked: true
  },
  {
    id: '3',
    type: 'discussion',
    author: {
      name: 'NamiFan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      level: 28
    },
    content: 'En sevdiğiniz One Piece arc\'ı hangisi? Benim için Enies Lobby! Robin\'in hikayesi çok duygusalydı 😭',
    timestamp: '6 hours ago',
    reactions: { likes: 45, comments: 12 },
    isLiked: false
  }
];

const mapActivityToPost = (activity: NakamaActivity): AnimePost => {
  const image = activity.anime?.image || activity.manga?.image;
  const images = image ? [image] : undefined;

  return {
    id: activity.id,
    author: {
      name: activity.author.name,
      avatar: activity.author.avatar,
      level: activity.author.level,
      favoriteAnime: activity.anime?.title || activity.manga?.title || 'Anime Lover',
    },
    content: activity.content,
    images,
    animeTags: activity.anime ? [activity.anime.title] : [],
    mangaTags: activity.manga ? [activity.manga.title] : [],
    reactions: {
      likes: activity.reactions.likes,
      comments: activity.reactions.comments,
      shares: 0,
    },
    timestamp: activity.timestamp,
    type: activity.type === 'review' ? 'review' : 'text',
    comments: [],
  };
};

const resolveApiImageUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

const mapServerCommunityToState = (
  server: PrefetchedCommunity | null | undefined,
  fallbackId: string
): Partial<NakamaCommunity> => {
  const partial: Partial<NakamaCommunity> = {
    id: fallbackId,
  };

  if (!server) {
    return partial;
  }

  partial.id = String(server.id ?? fallbackId);

  const name =
    server.communityName ||
    server.community_name ||
    server.communitySlug ||
    server.community_slug;

  if (name) {
    partial.name = name;
  }

  const description =
    server.communityDescription ??
    server.community_description;

  if (typeof description === 'string') {
    partial.description = description;
  }

  const coverImages = Array.isArray(server.communityCoverImages)
    ? server.communityCoverImages
    : Array.isArray(server.community_cover_images)
      ? server.community_cover_images
      : undefined;

  const coverImage = coverImages
    ? coverImages.find(
        (image): image is string => typeof image === 'string' && image.trim().length > 0
      )
    : undefined;

  if (coverImage) {
    const resolved = resolveApiImageUrl(coverImage);
    if (resolved) {
      partial.banner = resolved;
    }
  }

  const profileImages = Array.isArray(server.communityImages)
    ? server.communityImages
    : Array.isArray(server.community_images)
      ? server.community_images
      : undefined;

  const profileImage = profileImages
    ? profileImages.find(
        (image): image is string => typeof image === 'string' && image.trim().length > 0
      )
    : undefined;

  if (profileImage) {
    const resolved = resolveApiImageUrl(profileImage);
    if (resolved) {
      partial.avatar = resolved;
    }
  }

  const membersCountRaw = server.communityMember ?? server.member_count;
  const membersCount = Number(membersCountRaw);
  if (Number.isFinite(membersCount)) {
    partial.members = membersCount;
  }

  const activeMembersRaw = server.active_member_count ?? membersCountRaw;
  const activeMembers = Number(activeMembersRaw);
  if (Number.isFinite(activeMembers)) {
    partial.activeMembers = Math.max(activeMembers, 1);
  }

  const createdAt = server.createdAt || server.created_at;
  if (typeof createdAt === 'string' && createdAt.trim().length) {
    partial.createdAt = createdAt;
  }

  const tagsSource = Array.isArray(server.communityTags)
    ? server.communityTags
    : Array.isArray(server.community_tags)
      ? server.community_tags
      : undefined;

  if (tagsSource) {
    const tags = tagsSource.filter(
      (tag): tag is string => typeof tag === 'string' && tag.trim().length > 0
    );
    if (tags.length) {
      partial.tags = tags;
    }
  }

  const rulesSource = Array.isArray(server.communityRules)
    ? server.communityRules
    : Array.isArray(server.community_rules)
      ? server.community_rules
      : undefined;

  if (rulesSource) {
    const rules = rulesSource.filter(
      (rule): rule is string => typeof rule === 'string' && rule.trim().length > 0
    );
    if (rules.length) {
      partial.rules = rules;
    }
  }

  return partial;
};

interface NakamaPageProps {
  nakamaId: string;
  initialCommunity?: PrefetchedCommunity | null;
}

const NakamaPage: React.FC<NakamaPageProps> = ({ nakamaId, initialCommunity }) => {
  const { user } = useAuth();
  const { theme, colors } = useTheme();
  const [nakama, setNakama] = useState<NakamaCommunity>(() => ({
    ...sampleNakama,
    ...mapServerCommunityToState(initialCommunity, String(nakamaId)),
  }));
  const [members, setMembers] = useState<NakamaMember[]>(sampleMembers);
  const [posts, setPosts] = useState<AnimePost[]>(() => sampleActivities.map(mapActivityToPost));
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'rules'>('feed');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(
    () => new Set(sampleActivities.filter((activity) => activity.isLiked).map((activity) => activity.id))
  );
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [showReplyBox, setShowReplyBox] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [newReply, setNewReply] = useState<Record<string, string>>({});
  const commentInputRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [newPost, setNewPost] = useState('');
  const [selectedAnimeTags, setSelectedAnimeTags] = useState<string[]>([]);
  const [selectedMangaTags, setSelectedMangaTags] = useState<string[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const postTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [bannerImages, setBannerImages] = useState<string[]>(() => {
    const primary = Array.isArray(initialCommunity?.communityCoverImages)
      ? (initialCommunity?.communityCoverImages as Array<string | null | undefined>)
      : Array.isArray(initialCommunity?.community_cover_images)
        ? (initialCommunity?.community_cover_images as Array<string | null | undefined>)
        : [];
    const resolved = primary
      .map((image) => resolveApiImageUrl(image))
      .filter((url): url is string => Boolean(url));
    return resolved.length ? resolved : [sampleNakama.banner];
  });
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [userLocale, setUserLocale] = useState('en-US');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator?.language) {
      setUserLocale(window.navigator.language);
    }
  }, []);

  const formattedCreatedAt = formatCommunityDate(nakama.createdAt, userLocale);

  // Load community data, membership, and posts
  useEffect(() => {
    const communityIdNum = Number(nakamaId);
    if (!Number.isFinite(communityIdNum)) return;

    const fetchCommunity = async () => {
      try {
        const res = await fetch(`${API_BASE}/community?communityId=${communityIdNum}`);
        if (!res.ok) return;
        const data = await res.json();
        setNakama(prev => ({
          ...prev,
          ...mapServerCommunityToState(data?.community, String(communityIdNum)),
        }));
        const coverImages = Array.isArray(data?.community?.communityCoverImages)
          ? (data?.community?.communityCoverImages as Array<string | null | undefined>)
          : Array.isArray(data?.community?.community_cover_images)
            ? (data?.community?.community_cover_images as Array<string | null | undefined>)
            : [];
        if (coverImages.length) {
          const resolved = coverImages
            .map((image) => resolveApiImageUrl(image))
            .filter((url): url is string => Boolean(url));
          if (resolved.length) {
            setBannerImages(resolved);
            setActiveBannerIndex(0);
          }
        }
      } catch (e) {
        // noop
      }
    };

    const fetchMembership = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/community/check-membership?communityId=${communityIdNum}&userId=${encodeURIComponent(user.uid)}`);
        if (!res.ok) return;
        const data = await res.json();
        setNakama(prev => ({ ...prev, isJoined: Boolean(data.isMember) }));
      } catch (_) {}
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/community/posts?communityId=${communityIdNum}&userId=${
            user ? encodeURIComponent(user.uid) : ''
          }&limit=20&offset=0`
        );
        if (!res.ok) return;
        const data = await res.json();
        const postsArr = Array.isArray(data.posts) ? data.posts : [];
        const likedSet = new Set<string>();
        const mappedPosts: AnimePost[] = postsArr.map((p: any) => {
          const postId = String(p.id);
          if (p.isLiked) {
            likedSet.add(postId);
          }
          const rawImages = Array.isArray(p.images)
            ? p.images.filter(Boolean)
            : p.image
              ? [p.image]
              : [];

          const animeTags =
            Array.isArray(p.animeTags) && p.animeTags.length
              ? p.animeTags
              : Array.isArray(p.anime_tags)
                ? p.anime_tags
                : [];
          const mangaTags =
            Array.isArray(p.mangaTags) && p.mangaTags.length
              ? p.mangaTags
              : Array.isArray(p.manga_tags)
                ? p.manga_tags
                : [];

          return {
            id: postId,
            author: {
              name: p.author_name || p.username || 'User',
              avatar:
                p.author_avatar ||
                p.avatar ||
                'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              level: p.author_level ?? 1,
              favoriteAnime: p.favorite_anime || p.favoriteAnime || 'Anime Lover',
            },
            content: p.post_content || p.content || p.postTitle || '',
            images: rawImages.length ? rawImages : undefined,
            animeTags,
            mangaTags,
            reactions: {
              likes: p.like_count ?? 0,
              comments: p.comment_count ?? 0,
              shares: p.share_count ?? 0,
            },
            timestamp: p.created_at || 'now',
            type:
              p.type === 'review' || p.type === 'recommendation'
                ? p.type
                : 'text',
            comments: [],
          };
        });
        setPosts(mappedPosts);
        setLikedPosts(likedSet);
      } catch (_) {}
    };

    if (!initialCommunity) {
      fetchCommunity();
    }
    fetchMembership();
    fetchPosts();
  }, [nakamaId, user, initialCommunity]);

  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [bannerImages, bannerImages.length]);

  useEffect(() => {
    expandedComments.forEach((postId) => {
      setTimeout(() => {
        const inputRef = commentInputRefs.current[postId];
        if (inputRef) {
          inputRef.focus();
        }
      }, 200);
    });
  }, [expandedComments]);
  const toggleTag = (tag: string, type: 'anime' | 'manga') => {
    if (type === 'anime') {
      setSelectedAnimeTags((prev) =>
        prev.includes(tag) ? prev.filter((existing) => existing !== tag) : [...prev, tag]
      );
    } else {
      setSelectedMangaTags((prev) =>
        prev.includes(tag) ? prev.filter((existing) => existing !== tag) : [...prev, tag]
      );
    }
  };

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return;
    setNewPost('');
    setSelectedAnimeTags([]);
    setSelectedMangaTags([]);
    setShowCreatePost(false);
  };


  const handleJoinNakama = async () => {
    if (!user) return;
    const communityIdNum = Number(nakamaId);
    try {
      const res = await fetch(`${API_BASE}/community/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId: communityIdNum, userId: Number(user.uid) || user.uid })
      });
      if (!res.ok && res.status !== 409) return; // 409 if already joined
      setNakama(prev => ({
        ...prev,
        isJoined: true,
        members: prev.members + 1,
        activeMembers: Math.max(prev.activeMembers, 1)
      }));
      const newMember: NakamaMember = {
        id: user.uid,
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1,
        role: 'member',
        joinedAt: 'Just now',
        isOnline: true,
        favoriteGenre: 'Adventure'
      };
      setMembers(prev => [newMember, ...prev]);
      setShowJoinModal(false);
    } catch (_) {}
  };

  const handleLeaveNakama = async () => {
    if (!user) return;
    const communityIdNum = Number(nakamaId);
    try {
      const res = await fetch(`${API_BASE}/community/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communityId: communityIdNum, userId: Number(user.uid) || user.uid })
      });
      if (!res.ok) return;
      setNakama(prev => ({
        ...prev,
        isJoined: false,
        members: Math.max(0, prev.members - 1),
      }));
      setMembers(prev => prev.filter(m => m.id !== user.uid));
    } catch (_) {}
  };

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleLike = (postId: string) => {
    const isCurrentlyLiked = likedPosts.has(postId);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                likes: isCurrentlyLiked
                  ? Math.max(0, post.reactions.likes - 1)
                  : post.reactions.likes + 1,
              },
            }
          : post
      )
    );

    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const toggleComments = (postId: string) => {
    const willOpen = !expandedComments.has(postId);

    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    if (willOpen) {
      setTimeout(() => {
        const inputRef = commentInputRefs.current[postId];
        if (inputRef) {
          inputRef.focus();
          inputRef.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 200);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const toggleReplyBox = (commentId: string) => {
    setShowReplyBox((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddComment = (postId: string) => {
    const content = newComment[postId]?.trim();
    if (!content || !user) return;

    const comment: Comment = {
      id: `${postId}-comment-${Date.now()}`,
      author: {
        name: user.displayName || 'Anonymous',
        avatar:
          user.photoURL ||
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1,
      },
      content,
      timestamp: 'Şimdi',
      replies: [],
      reactions: { likes: 0 },
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, comment],
              reactions: {
                ...post.reactions,
                comments: post.reactions.comments + 1,
              },
            }
          : post
      )
    );

    setNewComment((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleAddReply = (postId: string, commentId: string) => {
    const content = newReply[commentId]?.trim();
    if (!content || !user) return;

    const reply: Comment = {
      id: `${commentId}-reply-${Date.now()}`,
      author: {
        name: user.displayName || 'Anonymous',
        avatar:
          user.photoURL ||
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1,
      },
      content,
      timestamp: 'Şimdi',
      replies: [],
      reactions: { likes: 0 },
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, reply] }
              : comment
          ),
        };
      })
    );

    setNewReply((prev) => ({ ...prev, [commentId]: '' }));
    setShowReplyBox((prev) => ({ ...prev, [commentId]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating anime elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🏴‍☠️</div>
        <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🎌</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
      </div>

      <div className="relative z-10">
        <NakamaBanner
          nakama={nakama}
          onJoinClick={() => setShowJoinModal(true)}
          onLeaveClick={handleLeaveNakama}
          bannerImages={bannerImages}
          activeBannerIndex={activeBannerIndex}
          createdAtText={formattedCreatedAt}
        />

        <NakamaContent
          nakama={nakama}
          members={members}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          posts={posts}
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
          createdAtText={formattedCreatedAt}
          newPost={newPost}
          onChangeNewPost={(value) => setNewPost(value)}
          showTagSelection={showCreatePost}
          onToggleTagSelection={() => setShowCreatePost((prev) => !prev)}
          selectedAnimeTags={selectedAnimeTags}
          selectedMangaTags={selectedMangaTags}
          onToggleTag={toggleTag}
          onSubmitPost={handleCreatePost}
          popularAnimeTags={POPULAR_ANIME_TAGS}
          popularMangaTags={POPULAR_MANGA_TAGS}
          postTextareaRef={postTextareaRef}
        />
      </div>

      <JoinNakamaModal
        isOpen={showJoinModal}
        nakamaName={nakama.name}
        onClose={() => setShowJoinModal(false)}
        onConfirm={handleJoinNakama}
      />
    </div>
  );
};

export default NakamaPage;

