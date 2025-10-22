"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, MessageCircle, Share2, Bookmark, Star, Sparkles, Zap, Users, 
  TrendingUp, Camera, Image, Video, Music, Hash, Smile, Plus, 
  Crown, Shield, Settings, Bell, UserPlus, Calendar, MapPin,
  Play, Pause, Volume2, MoreHorizontal, ThumbsUp, MessageSquare, ChevronUp,
  Eye, Clock, User, ThumbsDown, Flag, Edit3, Trash2
} from 'lucide-react';

// Manga Detail Interface
interface MangaDetail {
  id: string;
  title: string;
  titleEnglish?: string;
  titleJapanese?: string;
  synopsis: string;
  imageUrl: string;
  score: number;
  status: string;
  genres: string[];
  chapters: number;
  volumes: number;
  publishedFrom: string;
  publishedTo?: string;
  author: string;
  artist: string;
  demographic: string;
  rating: string;
  views: number;
  favorites: number;
}

// Chapter Interface
interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: number;
  uploadDate: string;
  views: number;
  isRead: boolean;
}

// Comment Interface
interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: string;
  rating: number;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
}

// Sample Data
const sampleManga: MangaDetail = {
  id: 'one-piece',
  title: 'One Piece',
  titleEnglish: 'One Piece',
  titleJapanese: 'ワンピース',
  synopsis: 'Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates. With a course charted for the treacherous waters of the Grand Line and beyond, this is one captain who\'ll never give up until he\'s claimed the greatest treasure on Earth: the Legendary One Piece!',
  imageUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=600&fit=crop',
  score: 9.2,
  status: 'Ongoing',
  genres: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Shounen'],
  chapters: 1095,
  volumes: 105,
  publishedFrom: '1997-07-22',
  publishedTo: null,
  author: 'Eiichiro Oda',
  artist: 'Eiichiro Oda',
  demographic: 'Shounen',
  rating: 'T',
  views: 2500000,
  favorites: 150000
};

const sampleChapters: Chapter[] = [
  {
    id: '1',
    number: 1095,
    title: 'The Final War Begins',
    pages: 19,
    uploadDate: '2 days ago',
    views: 125000,
    isRead: false
  },
  {
    id: '2',
    number: 1094,
    title: 'Luffy vs Blackbeard',
    pages: 18,
    uploadDate: '1 week ago',
    views: 118000,
    isRead: true
  },
  {
    id: '3',
    number: 1093,
    title: 'The Ancient Weapons',
    pages: 20,
    uploadDate: '2 weeks ago',
    views: 112000,
    isRead: true
  },
  {
    id: '4',
    number: 1092,
    title: 'Shanks Arrives',
    pages: 17,
    uploadDate: '3 weeks ago',
    views: 108000,
    isRead: true
  },
  {
    id: '5',
    number: 1091,
    title: 'The Will of D',
    pages: 19,
    uploadDate: '1 month ago',
    views: 105000,
    isRead: true
  }
];

const sampleComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'LuffyFan2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      level: 25
    },
    content: 'This chapter was absolutely incredible! The art quality is getting better and better. Oda never disappoints! 🔥',
    timestamp: '2 hours ago',
    rating: 5,
    likes: 23,
    replies: [
      {
        id: 'r1',
        author: {
          name: 'ZoroLover',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          level: 18
        },
        content: 'I agree! The fight scenes are getting more intense!',
        timestamp: '1 hour ago',
        rating: 0,
        likes: 5,
        replies: [],
        isLiked: false
      }
    ],
    isLiked: false
  },
  {
    id: '2',
    author: {
      name: 'NamiFan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      level: 22
    },
    content: 'The character development in this arc is amazing. Can\'t wait for the next chapter!',
    timestamp: '4 hours ago',
    rating: 4,
    likes: 15,
    replies: [],
    isLiked: true
  }
];

interface MangaDetailPageProps {
  mangaId: string;
}

const MangaDetailPage: React.FC<MangaDetailPageProps> = ({ mangaId }) => {
  const { user } = useAuth();
  const [manga, setManga] = useState<MangaDetail>(sampleManga);
  const [chapters, setChapters] = useState<Chapter[]>(sampleChapters);
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [activeTab, setActiveTab] = useState<'chapters' | 'comments' | 'reviews'>('chapters');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: user.displayName || 'Anonymous',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: Math.floor(Math.random() * 50) + 1
      },
      content: newComment,
      timestamp: 'Just now',
      rating: userRating,
      likes: 0,
      replies: [],
      isLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setUserRating(0);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating manga elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">📖</div>
        <div className="absolute top-40 right-20 text-4xl opacity-30 animate-float-reverse">⭐</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-25 animate-float">🎨</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-35 animate-float-reverse">✨</div>
      </div>

      <div className="relative z-10">
        {/* Manga Header */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={manga.imageUrl}
            alt={manga.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Manga Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end gap-6">
              <img
                src={manga.imageUrl}
                alt={manga.title}
                className="w-32 h-48 rounded-2xl border-4 border-white/20 shadow-2xl"
              />
              <div className="flex-1">
                <h1 className="text-5xl font-bold text-white mb-2">{manga.title}</h1>
                {manga.titleJapanese && (
                  <p className="text-2xl text-gray-300 mb-2">{manga.titleJapanese}</p>
                )}
                <p className="text-lg text-gray-300 mb-4 max-w-3xl">{manga.synopsis}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className="text-white font-bold text-xl">{manga.score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">{manga.views.toLocaleString()} görüntüleme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-white font-semibold">{manga.favorites.toLocaleString()} favori</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">{manga.chapters} bölüm</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {manga.genres.map(genre => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Author Info */}
                <div className="text-gray-300 text-sm">
                  <span className="font-semibold">Yazar:</span> {manga.author} • 
                  <span className="font-semibold"> Sanatçı:</span> {manga.artist} • 
                  <span className="font-semibold"> Durum:</span> {manga.status}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBookmark}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                    isBookmarked
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Kaydedildi' : 'Kaydet'}
                </button>
                <button
                  onClick={handleFavorite}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center gap-2 ${
                    isFavorited
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Favorilerde' : 'Favorile'}
                </button>
                <button className="px-6 py-3 bg-white/20 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 mb-6">
            <div className="flex gap-2">
              {[
                { id: 'chapters', label: 'Bölümler', icon: Bookmark },
                { id: 'comments', label: 'Yorumlar', icon: MessageCircle },
                { id: 'reviews', label: 'İncelemeler', icon: Star }
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
          {activeTab === 'chapters' && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-2xl mb-6">Bölümler ({chapters.length})</h3>
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {chapter.number}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg">Bölüm {chapter.number}</h4>
                          <p className="text-gray-300">{chapter.title}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span>{chapter.pages} sayfa</span>
                            <span>•</span>
                            <span>{chapter.uploadDate}</span>
                            <span>•</span>
                            <span>{chapter.views.toLocaleString()} görüntüleme</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {chapter.isRead && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            Okundu
                          </span>
                        )}
                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                          <Play className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add Comment */}
              {user && (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-xl mb-4">Yorum Ekle</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-purple-400"
                    />
                    <span className="text-white font-semibold">{user.displayName || 'Anonymous'}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    <label className="text-white font-semibold mb-2 block">Puanınız</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(rating)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            rating <= userRating
                              ? 'bg-yellow-500 text-white'
                              : 'bg-white/20 text-gray-400 hover:bg-white/30'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${rating <= userRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Manga hakkında düşüncelerinizi paylaşın..."
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                  />
                  
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Yorum Gönder
                    </button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-12 h-12 rounded-full border border-purple-400"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{comment.author.name}</span>
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                            Lv.{comment.author.level}
                          </span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                        </div>
                        {comment.rating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                className={`w-4 h-4 ${
                                  rating <= comment.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-white mb-4">{comment.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          comment.isLiked
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-blue-400 rounded-xl transition-all">
                        <MessageCircle className="w-4 h-4" />
                        <span>Yanıtla</span>
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-white/20">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-white/5 rounded-xl p-4 mb-3">
                            <div className="flex items-center gap-3 mb-2">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.name}
                                className="w-8 h-8 rounded-full border border-purple-400"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-sm">{reply.author.name}</span>
                                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                                  Lv.{reply.author.level}
                                </span>
                                <span className="text-gray-400 text-xs">•</span>
                                <span className="text-gray-400 text-xs">{reply.timestamp}</span>
                              </div>
                            </div>
                            <p className="text-white text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-2xl mb-6">İncelemeler</h3>
              <div className="text-center text-gray-300 py-12">
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Henüz inceleme bulunmuyor. İlk incelemeyi siz yazın!</p>
              </div>
            </div>
          )}
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

export default MangaDetailPage;
