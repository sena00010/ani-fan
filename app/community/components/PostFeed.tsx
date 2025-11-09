'use client';

import React from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Bookmark, Heart, MessageCircle, Share2, Sparkles, Star, Users, Zap } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { AnimePost, ThemeColors } from '../types';
import type { ThemeMode } from '@/contexts/ThemeContext';

type CommentState = Record<string, string>;
type ReplyState = Record<string, string>;
type ReplyBoxState = Record<string, boolean>;

interface PostFeedProps {
  filteredPosts: AnimePost[];
  theme: ThemeMode;
  colors: ThemeColors;
  bookmarkedPosts: Set<string>;
  likedPosts: Set<string>;
  expandedComments: Set<string>;
  expandedReplies: Set<string>;
  showReplyBox: ReplyBoxState;
  newComment: CommentState;
  newReply: ReplyState;
  user: User | null;
  commentInputRefs: MutableRefObject<Record<string, HTMLTextAreaElement | null>>;
  handleBookmark: (postId: string) => void;
  handleLike: (postId: string) => void;
  toggleComments: (postId: string) => void;
  toggleReplies: (commentId: string) => void;
  toggleReplyBox: (commentId: string) => void;
  handleAddComment: (postId: string) => void;
  handleAddReply: (postId: string, commentId: string) => void;
  setNewComment: Dispatch<SetStateAction<CommentState>>;
  setNewReply: Dispatch<SetStateAction<ReplyState>>;
}

const PostFeed: React.FC<PostFeedProps> = ({
  filteredPosts,
  theme,
  colors,
  bookmarkedPosts,
  likedPosts,
  expandedComments,
  expandedReplies,
  showReplyBox,
  newComment,
  newReply,
  user,
  commentInputRefs,
  handleBookmark,
  handleLike,
  toggleComments,
  toggleReplies,
  toggleReplyBox,
  handleAddComment,
  handleAddReply,
  setNewComment,
  setNewReply
}) => {
  return (
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
                  {post.autoUpdateData.category === 'anime'
                    ? 'Animeyi İzle'
                    : post.autoUpdateData.category === 'manga'
                      ? 'Mangayı Oku'
                      : 'Haberi Oku'}
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
            {post.animeTags.map((tag) => (
              <a
                key={tag}
                href={`/animes/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30 hover:bg-blue-500/30 transition-all cursor-pointer"
              >
                📺 {tag}
              </a>
            ))}
            {post.mangaTags.map((tag) => (
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
                        ref={(el) => {
                          commentInputRefs.current[post.id] = el;
                        }}
                        value={newComment[post.id] || ''}
                        onChange={(e) =>
                          setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
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
                  <div
                    className={`text-center p-4 rounded-xl ${
                      theme === 'light'
                        ? 'bg-amber-50 border border-amber-300'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  >
                    <p className={`${colors.text} mb-2`}>Yorum yapmak için giriş yapmalısınız</p>
                    <textarea
                      ref={(el) => {
                        commentInputRefs.current[post.id] = el;
                      }}
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
                          {expandedReplies.has(comment.id)
                            ? 'Yanıtları Gizle'
                            : `${comment.replies.length} Yanıt`}
                        </button>
                      )}
                    </div>

                    {/* Reply Box */}
                    {showReplyBox[comment.id] && user && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={
                              user.photoURL ||
                              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
                            }
                            alt="Profile"
                            className="w-6 h-6 rounded-full border border-purple-400"
                          />
                          <span className="text-white font-semibold text-sm">
                            {user.displayName || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <textarea
                            value={newReply[comment.id] || ''}
                            onChange={(e) =>
                              setNewReply((prev) => ({ ...prev, [comment.id]: e.target.value }))
                            }
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
  );
};

export default PostFeed;

