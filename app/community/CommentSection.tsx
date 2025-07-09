import { AnimatePresence, motion } from "framer-motion";
import { Send, Smile } from "lucide-react";
import React, { useState } from "react";

interface ReactionPickerProps {
    onSelect: (reaction: string) => void;
    onClose: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, onClose }) => {
    const reactions = ["👍", "❤️", "😆", "😮", "😢", "😡", "🔥", "💯", "👏", "🎉"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2 z-20"
        >
            {reactions.map((reaction) => (
                <motion.button
                    key={reaction}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    onClick={() => {
                        onSelect(reaction);
                        onClose();
                    }}
                >
                    <span className="text-xl">{reaction}</span>
                </motion.button>
            ))}
        </motion.div>
    );
};

interface CommentInputProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    initialContent?: string;
    autoFocus?: boolean;
    buttonText?: string;
    disabled?: boolean;
    className?: string;
    showAvatar?: boolean;
    avatarUrl?: string;
    userName?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
                                                       onSubmit,
                                                       placeholder = "Yorum yazın...",
                                                       initialContent = "",
                                                       autoFocus = false,
                                                       buttonText = "Gönder",
                                                       disabled = false,
                                                       className = "",
                                                       showAvatar = false,
                                                       avatarUrl = "/default.jpg",
                                                       userName = "User"
                                                   }) => {
    const [content, setContent] = useState(initialContent);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = () => {
        if (content.trim() && !disabled) {
            onSubmit(content.trim());
            setContent("");
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-start gap-3">
                {showAvatar && (
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                            src={avatarUrl}
                            alt={userName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/default.jpg';
                            }}
                        />
                    </div>
                )}

                <div className="flex-1 relative">
          <textarea
              value={content}
              onChange={(e) => {
                  setContent(e.target.value);
                  setIsTyping(!!e.target.value.trim());
              }}
              placeholder={placeholder}
              autoFocus={autoFocus}
              disabled={disabled}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[80px] p-3 pr-12 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

                    {/* Emoji button */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <button
                            type="button"
                            disabled={disabled}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors relative disabled:opacity-50"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile className="w-5 h-5" />
                            <AnimatePresence>
                                {showEmojiPicker && !disabled && (
                                    <ReactionPicker
                                        onSelect={(emoji) => {
                                            setContent((prev) => prev + emoji);
                                            setIsTyping(true);
                                        }}
                                        onClose={() => setShowEmojiPicker(false)}
                                    />
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    {/* Send button */}
                    <AnimatePresence>
                        {isTyping && !disabled && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={handleSubmit}
                                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                {buttonText}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CommentInput;