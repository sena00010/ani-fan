import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

type TagType = 'anime' | 'manga';

interface TagSelectionProps {
  isVisible: boolean;
  popularAnimeTags: string[];
  popularMangaTags: string[];
  selectedAnimeTags: string[];
  selectedMangaTags: string[];
  onToggleTag: (tag: string, type: TagType) => void;
}

const TagSelection: React.FC<TagSelectionProps> = ({
  isVisible,
  popularAnimeTags,
  popularMangaTags,
  selectedAnimeTags,
  selectedMangaTags,
  onToggleTag
}) => {
  const { theme, colors } = useTheme();

  if (!isVisible) {
    return null;
  }

  const unselectedClasses =
    theme === 'light'
      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      : 'bg-white/10 text-gray-300 hover:bg-white/20';

  const getSelectedClasses = (type: TagType) =>
    type === 'anime' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white';

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className={`font-semibold mb-2 block ${colors.text}`}>Anime Tags</label>
        <div className="flex flex-wrap gap-2">
          {popularAnimeTags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag, 'anime')}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedAnimeTags.includes(tag)
                  ? getSelectedClasses('anime')
                  : unselectedClasses
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
          {popularMangaTags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag, 'manga')}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedMangaTags.includes(tag)
                  ? getSelectedClasses('manga')
                  : unselectedClasses
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSelection;

