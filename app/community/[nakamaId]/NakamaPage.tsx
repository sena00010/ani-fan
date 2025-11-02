"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, MessageCircle, Share2, Bookmark, Star, Sparkles, Zap, Users, 
  TrendingUp, Camera, Image, Video, Music, Hash, Smile, Plus, 
  Crown, Shield, Settings, Bell, UserPlus, Calendar, MapPin,
  Play, Pause, Volume2, MoreHorizontal, ThumbsUp, MessageSquare
} from 'lucide-react';

// Backend API base
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

// Nakama Community Interface
interface NakamaCommunity {
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

// Member Interface
interface NakamaMember {
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

// Activity Post Interface
interface NakamaActivity {
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

// Sample Data
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
  createdAt: '',
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

interface NakamaPageProps {
  nakamaId: string;
}

const NakamaPage: React.FC<NakamaPageProps> = ({ nakamaId }) => {
  const { user } = useAuth();
  const [nakama, setNakama] = useState<NakamaCommunity>(sampleNakama);
  const [members, setMembers] = useState<NakamaMember[]>(sampleMembers);
  const [activities, setActivities] = useState<NakamaActivity[]>(sampleActivities);
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'rules'>('feed');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());

  // Load community data, membership, and posts
  useEffect(() => {
    const communityIdNum = Number(nakamaId);
    if (!Number.isFinite(communityIdNum)) return;

    const fetchCommunity = async () => {
      try {
        const res = await fetch(`${API_BASE}/community?communityId=${communityIdNum}`);
        if (!res.ok) return;
        const data = await res.json();
        const c = data.community;
        setNakama(prev => ({
          ...prev,
          id: String(c?.id ?? communityIdNum),
          name: c?.name || c?.community_name || prev.name,
          description: c?.description || prev.description,
          members: c?.member_count ?? prev.members,
          activeMembers: c?.active_member_count ?? prev.activeMembers,
          createdAt: c?.created_at || prev.createdAt,
          tags: Array.isArray(c?.tags) ? c.tags : prev.tags,
        }));
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
        const res = await fetch(`${API_BASE}/community/posts?communityId=${communityIdNum}&userId=${user ? encodeURIComponent(user.uid) : ''}&limit=20&offset=0`);
        if (!res.ok) return;
        const data = await res.json();
        const posts = Array.isArray(data.posts) ? data.posts : [];
        const mapped: NakamaActivity[] = posts.map((p: any) => ({
          id: String(p.id),
          type: 'discussion',
          author: {
            name: p.author_name || p.username || 'User',
            avatar: p.author_avatar || p.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            level: 1,
          },
          content: p.post_content || p.content || p.postTitle || '',
          timestamp: p.created_at || 'now',
          reactions: {
            likes: p.like_count ?? 0,
            comments: p.comment_count ?? 0,
          },
          isLiked: Boolean(p.isLiked),
        }));
        setActivities(mapped);
      } catch (_) {}
    };

    fetchCommunity();
    fetchMembership();
    fetchPosts();
  }, [nakamaId, user]);

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

  const handleLikeActivity = (activityId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const isLiked = likedActivities.has(activityId);
        return {
          ...activity,
          reactions: {
            ...activity.reactions,
            likes: isLiked ? activity.reactions.likes - 1 : activity.reactions.likes + 1
          },
          isLiked: !isLiked
        };
      }
      return activity;
    }));

    setLikedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watching': return <Play className="w-4 h-4" />;
      case 'reading': return <Bookmark className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'discussion': return <MessageSquare className="w-4 h-4" />;
      case 'milestone': return <Crown className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'watching': return 'from-blue-500 to-cyan-500';
      case 'reading': return 'from-green-500 to-emerald-500';
      case 'review': return 'from-yellow-500 to-orange-500';
      case 'discussion': return 'from-purple-500 to-pink-500';
      case 'milestone': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
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
        {/* Community Banner */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={nakama.banner}
            alt={nakama.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Community Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end gap-6">
              <img
                src={nakama.avatar}
                alt={nakama.name}
                className="w-24 h-24 rounded-2xl border-4 border-white/20"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{nakama.name}</h1>
                <p className="text-gray-300 text-lg mb-4 max-w-2xl">{nakama.description}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">{nakama.members.toLocaleString()} üye</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">{nakama.activeMembers} aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">{nakama.createdAt}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {nakama.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Join Button */}
              <div className="flex flex-col gap-3">
                {!nakama.isJoined ? (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Katıl
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2" onClick={handleLeaveNakama}>
                      Ayrıl
                    </button>
                    <button className="px-6 py-3 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Bildirimler
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0">
              {/* Creator Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 mb-6">
                <h3 className="text-white font-bold text-xl mb-4">Kurucu</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={nakama.creator.avatar}
                      alt={nakama.creator.name}
                      className="w-12 h-12 rounded-full border-2 border-orange-400"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Lv.{nakama.creator.level}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{nakama.creator.name}</div>
                    <div className="text-gray-400 text-sm">Kurucu</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 mb-6">
                <h3 className="text-white font-bold text-xl mb-4">İstatistikler</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Toplam Üye</span>
                    <span className="text-white font-semibold">{nakama.members.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Aktif Üye</span>
                    <span className="text-white font-semibold">{nakama.activeMembers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Kuruluş</span>
                    <span className="text-white font-semibold">{nakama.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Online Members */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="text-white font-bold text-xl mb-4">Çevrimiçi Üyeler</h3>
                <div className="space-y-3">
                  {members.filter(member => member.isOnline).slice(0, 5).map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full border border-green-400"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-semibold">{member.name}</div>
                        <div className="text-gray-400 text-xs">Lv.{member.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Navigation Tabs */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 mb-6">
                <div className="flex gap-2">
                  {[
                    { id: 'feed', label: 'Aktivite', icon: Hash },
                    { id: 'members', label: 'Üyeler', icon: Users },
                    { id: 'rules', label: 'Kurallar', icon: Shield }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                        activeTab === id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Based on Active Tab */}
              {activeTab === 'feed' && (
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20"
                    >
                      {/* Activity Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getActivityColor(activity.type)} flex items-center justify-center text-white`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{activity.author.name}</span>
                            <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                              Lv.{activity.author.level}
                            </span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-400 text-sm">{activity.timestamp}</span>
                          </div>
                          <div className="text-gray-300 text-sm capitalize">{activity.type}</div>
                        </div>
                      </div>

                      {/* Activity Content */}
                      <p className="text-white mb-4">{activity.content}</p>

                      {/* Anime/Manga Card */}
                      {(activity.anime || activity.manga) && (
                        <div className="bg-white/5 rounded-2xl p-4 mb-4">
                          <div className="flex gap-4">
                            <img
                              src={activity.anime?.image || activity.manga?.image}
                              alt={activity.anime?.title || activity.manga?.title}
                              className="w-20 h-28 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg">
                                {activity.anime?.title || activity.manga?.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-gray-300">
                                  {activity.anime ? `Bölüm ${activity.anime.episode}` : `Bölüm ${activity.manga?.chapter}`}
                                </span>
                                {(activity.anime?.totalEpisodes || activity.manga?.totalChapters) && (
                                  <>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-gray-300">
                                      {activity.anime?.totalEpisodes || activity.manga?.totalChapters}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Activity Actions */}
                      <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleLikeActivity(activity.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                            activity.isLiked
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${activity.isLiked ? 'fill-current' : ''}`} />
                          <span>{activity.reactions.likes}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-blue-400 rounded-xl transition-all">
                          <MessageCircle className="w-5 h-5" />
                          <span>{activity.reactions.comments}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-green-400 rounded-xl transition-all">
                          <Share2 className="w-5 h-5" />
                          <span>Paylaş</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'members' && (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-xl mb-6">Tüm Üyeler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <div key={member.id} className="bg-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full border-2 border-purple-400"
                            />
                            {member.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-semibold">{member.name}</div>
                            <div className="text-gray-400 text-sm">Lv.{member.level}</div>
                          </div>
                          {member.role === 'creator' && <Crown className="w-5 h-5 text-yellow-400" />}
                          {member.role === 'admin' && <Shield className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div className="text-gray-300 text-sm mb-2">
                          {member.currentAnime && `İzliyor: ${member.currentAnime}`}
                          {member.currentManga && ` • Okuyor: ${member.currentManga}`}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Katıldı: {member.joinedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-xl mb-6">Topluluk Kuralları</h3>
                  <div className="space-y-4">
                    {nakama.rules.map((rule, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-white">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md w-full">
            <h3 className="text-white font-bold text-2xl mb-4">Nakama'ya Katıl</h3>
            <p className="text-gray-300 mb-6">
              {nakama.name} topluluğuna katılmak istediğinizden emin misiniz? 
              Bu toplulukta anime ve manga deneyimlerinizi paylaşabilir, 
              diğer üyelerle sohbet edebilirsiniz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                İptal
              </button>
              <button
                onClick={handleJoinNakama}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Katıl
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NakamaPage;

