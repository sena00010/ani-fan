import React from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { User } from 'firebase/auth';
import { Hash, Users as UsersIcon, Shield, Crown } from 'lucide-react';
import PostFeed from '../../components/PostFeed';
import PostCreationForm from '../../components/PostCreationForm';
import type { AnimePost, Comment } from '../../types';
import type { ThemeMode } from '@/contexts/ThemeContext';
import type { ThemeColors } from '../../types';
import type { NakamaCommunity, NakamaMember } from '../types';

type CommentState = Record<string, string>;
type ReplyState = Record<string, string>;
type ReplyBoxState = Record<string, boolean>;
type TagType = 'anime' | 'manga';

interface NakamaContentProps {
  nakama: NakamaCommunity;
  members: NakamaMember[];
  activeTab: 'feed' | 'members' | 'rules';
  onTabChange: (tab: 'feed' | 'members' | 'rules') => void;
  posts: AnimePost[];
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
  createdAtText: string;
  newPost: string;
  onChangeNewPost: (value: string) => void;
  showTagSelection: boolean;
  onToggleTagSelection: () => void;
  selectedAnimeTags: string[];
  selectedMangaTags: string[];
  onToggleTag: (tag: string, type: TagType) => void;
  onSubmitPost: () => void;
  popularAnimeTags: string[];
  popularMangaTags: string[];
  postTextareaRef: MutableRefObject<HTMLTextAreaElement | null>;
}

const tabs = [
  { id: 'feed' as const, label: 'Aktivite', icon: Hash },
  { id: 'members' as const, label: 'Üyeler', icon: UsersIcon },
  { id: 'rules' as const, label: 'Kurallar', icon: Shield },
];

const NakamaContent: React.FC<NakamaContentProps> = ({
  nakama,
  members,
  activeTab,
  onTabChange,
  posts,
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
  setNewReply,
  createdAtText,
  newPost,
  onChangeNewPost,
  showTagSelection,
  onToggleTagSelection,
  selectedAnimeTags,
  selectedMangaTags,
  onToggleTag,
  onSubmitPost,
  popularAnimeTags,
  popularMangaTags,
  postTextareaRef,
}) => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex gap-8">
      <div className="w-80 flex-shrink-0">
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
              <span className="text-white font-semibold">{createdAtText}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-xl mb-4">Çevrimiçi Üyeler</h3>
          <div className="space-y-3">
            {members
              .filter((member) => member.isOnline)
              .slice(0, 5)
              .map((member) => (
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

      <div className="flex-1">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 mb-6">
          <div className="flex gap-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
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

        {activeTab === 'feed' && (
          <div className="space-y-6">
            <PostCreationForm
              user={user}
              theme={theme}
              colors={colors}
              newPost={newPost}
              onChangePost={onChangeNewPost}
              onSubmit={onSubmitPost}
              showTagSelection={showTagSelection}
              onToggleTagSelection={onToggleTagSelection}
              selectedAnimeTags={selectedAnimeTags}
              selectedMangaTags={selectedMangaTags}
              onToggleTag={onToggleTag}
              popularAnimeTags={popularAnimeTags}
              popularMangaTags={popularMangaTags}
              textareaRef={postTextareaRef}
            />
            <PostFeed
              filteredPosts={posts}
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
                  <div className="text-gray-400 text-xs">Katıldı: {member.joinedAt}</div>
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
);

export default NakamaContent;

