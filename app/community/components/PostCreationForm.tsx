"use client";

import React from 'react';
import type { User } from 'firebase/auth';
import { Hash, Image as ImageIcon, Smile } from 'lucide-react';
import TagSelection from './TagSelection';

type TagType = 'anime' | 'manga';

interface PostCreationFormProps {
  user: User | null;
  theme: string;
  colors: {
    text: string;
    textSecondary: string;
  };
  newPost: string;
  onChangePost: (value: string) => void;
  onSubmit: () => void;
  showTagSelection: boolean;
  onToggleTagSelection: () => void;
  selectedAnimeTags: string[];
  selectedMangaTags: string[];
  onToggleTag: (tag: string, type: TagType) => void;
  popularAnimeTags: string[];
  popularMangaTags: string[];
  textareaRef?: React.RefObject<HTMLTextAreaElement> | React.MutableRefObject<HTMLTextAreaElement | null>;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({
  user,
  theme,
  colors,
  newPost,
  onChangePost,
  onSubmit,
  showTagSelection,
  onToggleTagSelection,
  selectedAnimeTags,
  selectedMangaTags,
  onToggleTag,
  popularAnimeTags,
  popularMangaTags,
  textareaRef,
}) => {
  if (!user) {
    return null;
  }

  const textareaProps = textareaRef ? { ref: textareaRef } : {};

  return (
    <div
      className={`backdrop-blur-md rounded-3xl p-6 mb-8 border ${
        theme === 'light'
          ? 'bg-white/95 border-gray-300/80 shadow-lg'
          : 'bg-white/10 border-white/20'
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={
            user.photoURL ||
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          }
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-purple-400"
        />
        <div>
          <div className={`font-semibold ${colors.text}`}>
            {user.displayName || 'Anonymous'}
          </div>
          <div className={`text-sm ${colors.textSecondary}`}>
            Share your anime thoughts!
          </div>
        </div>
      </div>

      <textarea
        {...textareaProps}
        value={newPost}
        onChange={(event) => onChangePost(event.target.value)}
        placeholder="What's on your mind about anime? Share your thoughts, reviews, or recommendations! ✨"
        className={`w-full rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:border-transparent ${
          theme === 'light'
            ? 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-amber-500'
            : 'bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-purple-500'
        }`}
        rows={3}
      />

      <TagSelection
        isVisible={showTagSelection}
        popularAnimeTags={popularAnimeTags}
        popularMangaTags={popularMangaTags}
        selectedAnimeTags={selectedAnimeTags}
        selectedMangaTags={selectedMangaTags}
        onToggleTag={onToggleTag}
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-4">
          <button
            onClick={onToggleTagSelection}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
            type="button"
          >
            <Hash className="w-4 h-4" />
            Add Tags
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
            type="button"
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
            type="button"
          >
            <Smile className="w-4 h-4" />
            Emoji
          </button>
        </div>

        <button
          onClick={onSubmit}
          disabled={!newPost.trim()}
          className={`px-6 py-2 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'light'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          }`}
          type="button"
        >
          Post ✨
        </button>
      </div>
    </div>
  );
};

export default PostCreationForm;

