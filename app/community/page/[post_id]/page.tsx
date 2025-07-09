"use client"
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Helper function to get a consistent color for communities
const getCommunityColor = (name:any) => {
    const colors = [
        "#FF4500",
        "#0079D3",
        "#1E88E5",
        "#FF9800",
        "#388E3C",
        "#7E57C2",
        "#D32F2F",
        "#00796B",
        "#FBC02D",
        "#C2185B",
    ];

    // Simple hash function to get consistent colors
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};
interface Author {
    username: string;
    avatar: string | null;
}

interface Comment {
    id: string;
    author: Author;
    content: string;
    createdAt: string;
    likeCount: number;
    replies: Comment[];
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: Author;
    communitySlug: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    comments: Comment[];
}

export default function CommunityPost() {
    const { postId, communitySlug } = useParams<{postId: string; communitySlug: string}>();
    const [post, setPost] = useState({
        id: "1",
        title: "Example Post Title Sena",
        content: "This is the content of the post...",
        author: {
            username: "exampleuser",
            avatar: null,
        },
        communitySlug: communitySlug || "community",
        createdAt: new Date().toISOString(),
        likeCount: 42,
        commentCount: 5,
        comments: [
            {
                id: "101",
                author: {
                    username: "commenter1",
                    avatar: null,
                },
                content: "This is a comment on the post",
                createdAt: new Date().toISOString(),
                likeCount: 8,
                replies: [],
            },
        ],
    });

    const [postVote, setPostVote] = useState<number>(0);
    const [commentVotes, setCommentVotes] = useState<Record<string, number>>({});
    const [newComment, setNewComment] = useState<string>("");
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    // Add new state for showing action menu
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                actionMenuRef.current &&
                !actionMenuRef.current.contains(event.target as Node)
            ) {
                setShowActionMenu(false);
            }
            if (
                shareMenuRef.current &&
                !shareMenuRef.current.contains(event.target as Node)
            ) {
                setShowShareOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Format relative time function
    const formatRelativeTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
        if (diffInSeconds < 31536000)
            return `${Math.floor(diffInSeconds / 2592000)}mo`;
        return `${Math.floor(diffInSeconds / 31536000)}y`;
    };


    // Handle post voting
    const handlePostVote = (value:any) => {
        if (postVote === value) {
            // If clicking the same vote button, remove the vote
            setPostVote(0);
            setPost((prev) => ({ ...prev, likeCount: prev.likeCount - value }));
        } else {
            // If changing vote, adjust count by the difference
            const diff = value - postVote;
            setPostVote(value);
            setPost((prev) => ({ ...prev, likeCount: prev.likeCount + diff }));
        }
    };

    // Handle comment voting
    const handleCommentVote = (commentId:any, direction:any) => {
        const value = direction === "up" ? 1 : -1;
        const currentVote = commentVotes[commentId] || 0;

        if (currentVote === value) {
            // Remove vote if clicking the same direction
            const newVotes = { ...commentVotes };
            delete newVotes[commentId];
            setCommentVotes(newVotes);
        } else {
            // Set or change vote
            setCommentVotes({ ...commentVotes, [commentId]: value });
        }
    };

    // Handle comment submission
    const handleCommentSubmit = (e:any) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newCommentObj = {
            id: `comment-${Date.now()}`,
            author: {
                username: "current_user",
                avatar: null,
            },
            content: newComment,
            createdAt: new Date().toISOString(),
            likeCount: 0,
            replies: [],
        };

        setPost((prev) => ({
            ...prev,
            comments: [newCommentObj, ...prev.comments],
            commentCount: prev.commentCount + 1,
        }));

        setNewComment("");
    };

    // Log parameters to verify they're coming through
    useEffect(() => {
        console.log("Route parameters:", { postId, communitySlug });
        // Here you would fetch the post data using these parameters
    }, [postId, communitySlug]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Separate breadcrumb from navbar */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Link
                            to="/"
                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Home
                        </Link>
                        <svg
                            className="h-4 w-4 mx-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <Link
                            to="/community"
                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
                            Communities
                        </Link>
                        <svg
                            className="h-4 w-4 mx-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <Link
                            to={`/community/${post.communitySlug}`}
                            className="hover:text-blue-500 dark:hover:text-blue-400"
                        >
              <span className="flex items-center">
                <div
                    className="h-5 w-5 rounded-full mr-1 flex items-center justify-center text-white text-xs font-medium"
                    style={{
                        backgroundColor: getCommunityColor(post.communitySlug),
                    }}
                >
                  {post.communitySlug.charAt(0).toUpperCase()}
                </div>
                r/{post.communitySlug}
              </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content with 12-column grid - Left sidebar removed */}
            <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-12 gap-5">
                    {/* Main content - post and comments - expanded left */}
                    <main className="col-span-12 lg:col-span-8">
                        {/* Post detail with enhanced voting */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
                            <div className="flex">
                                {/* Desktop vote buttons - FIXED DARK MODE BACKGROUND */}
                                <div className="hidden md:flex flex-col items-center py-3 px-2 bg-gray-50 dark:bg-gray-700">
                                    <button
                                        onClick={() => handlePostVote(1)}
                                        className={`p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600 ${
                                            postVote === 1 ? "text-orange-500" : ""
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    <span
                                        className={`text-sm font-medium my-1 ${
                                            postVote === 1
                                                ? "text-orange-500"
                                                : postVote === -1
                                                    ? "text-blue-500"
                                                    : "text-gray-800 dark:text-gray-200"
                                        }`}
                                    >
                    {post.likeCount}
                  </span>

                                    <button
                                        onClick={() => handlePostVote(-1)}
                                        className={`p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600 ${
                                            postVote === -1 ? "text-blue-500" : ""
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 011.06 1.06l-7.5 7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Post content */}
                                <div className="flex-1 p-4">
                                    {/* Mobile vote buttons */}
                                    <div className="flex md:hidden items-center mb-3 text-gray-500 dark:text-gray-400">
                                        <button
                                            onClick={() => handlePostVote(1)}
                                            className={`p-1 mr-1 rounded-sm ${
                                                postVote === 1 ? "text-orange-500" : ""
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>

                                        <span
                                            className={`text-sm font-medium mx-1 ${
                                                postVote === 1
                                                    ? "text-orange-500"
                                                    : postVote === -1
                                                        ? "text-blue-500"
                                                        : "text-gray-800 dark:text-gray-200"
                                            }`}
                                        >
                      {post.likeCount}
                    </span>

                                        <button
                                            onClick={() => handlePostVote(-1)}
                                            className={`p-1 ml-1 rounded-sm ${
                                                postVote === -1 ? "text-blue-500" : ""
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 011.06 1.06l-7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Post meta */}
                                    <div className="mb-3">
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            <Link
                                                to={`/community/${post.communitySlug}`}
                                                className="flex items-center font-medium text-gray-900 dark:text-white hover:underline mr-2"
                                            >
                                                <div
                                                    className="h-5 w-5 rounded-full mr-1 flex items-center justify-center text-white text-xs font-medium"
                                                    style={{
                                                        backgroundColor: getCommunityColor(
                                                            post.communitySlug
                                                        ),
                                                    }}
                                                >
                                                    {post.communitySlug.charAt(0).toUpperCase()}
                                                </div>
                                                r/{post.communitySlug}
                                            </Link>
                                            <span className="mx-1">•</span>
                                            <span>Posted by</span>
                                            <Link
                                                to={`/profile/${post.author.username}`}
                                                className="font-medium hover:underline mx-1"
                                            >
                                                u/{post.author.username}
                                            </Link>
                                            <span className="mx-1">•</span>
                                            <span title={new Date(post.createdAt).toLocaleString()}>
                        {formatRelativeTime(post.createdAt)}
                      </span>
                                        </div>

                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                            {post.title}
                                        </h1>
                                    </div>

                                    {/* Post content */}
                                    <div className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-6 break-words">
                                        {post.content}
                                    </div>

                                    {/* Post actions */}
                                    <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 text-gray-500 dark:text-gray-400">
                                        <button
                                            className="flex items-center px-2 py-1 mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                            onClick={() => commentInputRef.current?.focus()}
                                        >
                                            <svg
                                                className="w-5 h-5 mr-1.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            <span className="text-sm">
                        {post.commentCount} Comments
                      </span>
                                        </button>

                                        {/* Share button with dropdown */}
                                        <div className="relative">
                                            <button
                                                className="flex items-center px-2 py-1 mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                                onClick={() => setShowShareOptions(!showShareOptions)}
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-1.5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                                <span className="text-sm">Share</span>
                                            </button>

                                            {showShareOptions && (
                                                <div
                                                    ref={shareMenuRef}
                                                    className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1 border border-gray-200 dark:border-gray-700"
                                                >
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                                        </svg>
                                                        Facebook
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                                                        </svg>
                                                        Twitter
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                                                        </svg>
                                                        Copy Link
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <button className="flex items-center px-2 py-1 mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                            <svg
                                                className="w-5 h-5 mr-1.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                            <span className="text-sm">Save</span>
                                        </button>

                                        {/* More actions dropdown */}
                                        <div className="relative ml-auto">
                                            <button
                                                className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                                onClick={() => setShowActionMenu(!showActionMenu)}
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>

                                            {showActionMenu && (
                                                <div
                                                    ref={actionMenuRef}
                                                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1 border border-gray-200 dark:border-gray-700"
                                                >
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                            />
                                                        </svg>
                                                        Hide
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        Report
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comment form - FIXED TEXTAREA DARK MODE */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Comment as <span className="text-blue-500">u/current_user</span>
                            </div>
                            <form onSubmit={handleCommentSubmit}>
                <textarea
                    ref={commentInputRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full min-h-[120px] p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-gray-800 dark:text-gray-200"
                ></textarea>
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Sort comments */}
                        <div className="mb-4">
                            <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Sort By:
                </span>
                                <select className="bg-transparent text-sm text-gray-700 dark:text-gray-300 border-none focus:ring-0">
                                    <option value="best">Best</option>
                                    <option value="top">Top</option>
                                    <option value="new">New</option>
                                    <option value="controversial">Controversial</option>
                                    <option value="old">Old</option>
                                </select>
                            </div>
                        </div>

                        {/* Comments section */}
                        <div className="space-y-4">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment) => renderComment(comment))
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                                    <div className="text-gray-500 dark:text-gray-400">
                                        No comments yet. Be the first to share what you think!
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Redesigned right sidebar - NO COLORED HEADER */}
                    <aside className="hidden lg:block lg:col-span-4 space-y-4">
                        <div className="sticky top-4">
                            {/* Community info card - removed colored header */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">
                                <div className="p-4">
                                    <div className="flex items-center mb-3">
                                        <div
                                            className="h-10 w-10 rounded-full mr-3 flex items-center justify-center text-white text-base font-bold"
                                            style={{
                                                backgroundColor: getCommunityColor(post.communitySlug),
                                            }}
                                        >
                                            {post.communitySlug.charAt(0).toUpperCase()}
                                        </div>
                                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                            r/{post.communitySlug}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        A community for discussions about {post.communitySlug}.
                                    </p>

                                    {/* FIXED STATS BACKGROUND FOR DARK MODE */}
                                    <div className="grid grid-cols-3 gap-2 text-center mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                25.4k
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Members
                                            </div>
                                        </div>
                                        {/*<div>*/}
                                        {/*    <div className="font-medium text-gray-900 dark:text-white">*/}
                                        {/*        284*/}
                                        {/*    </div>*/}
                                        {/*    <div className="text-xs text-gray-500 dark:text-gray-400">*/}
                                        {/*        Online*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                #5
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Ranking
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-sm">
                                            Join
                                        </button>
                                        <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Community rules */}
                            {/*<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">*/}
                            {/*    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">*/}
                            {/*        <h3 className="font-medium text-gray-900 dark:text-white">*/}
                            {/*            Community Rules*/}
                            {/*        </h3>*/}
                            {/*        <button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">*/}
                            {/*            View All*/}
                            {/*        </button>*/}
                            {/*    </div>*/}
                        {/*        <div className="divide-y divide-gray-200 dark:divide-gray-700">*/}
                        {/*            {[*/}
                        {/*                "Remember the human",*/}
                        {/*                "Behave like you would in real life",*/}
                        {/*                "Look for the original source of content",*/}
                        {/*            ].map((rule, index) => (*/}
                        {/*                <div key={index} className="px-4 py-3">*/}
                        {/*                    <div className="flex items-center">*/}
                        {/*<span className="mr-2 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 w-5 h-5 flex items-center justify-center text-gray-800 dark:text-gray-200">*/}
                        {/*  {index + 1}*/}
                        {/*</span>*/}
                        {/*                        <span className="text-sm text-gray-800 dark:text-gray-200">*/}
                        {/*  {rule}*/}
                        {/*</span>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                            {/* Related posts -enpointi yoktu*/}
                          {/*  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">*/}
                          {/*      <div className="p-3 border-b border-gray-200 dark:border-gray-700">*/}
                          {/*          <h3 className="font-medium text-gray-900 dark:text-white">*/}
                          {/*              Related Posts*/}
                          {/*          </h3>*/}
                          {/*      </div>*/}
                          {/*      <div className="divide-y divide-gray-200 dark:divide-gray-700">*/}
                          {/*          {[*/}
                          {/*              {*/}
                          {/*                  title: "How to get started with running marathons?",*/}
                          {/*                  votes: 432,*/}
                          {/*                  comments: 57,*/}
                          {/*                  time: "2 days ago",*/}
                          {/*              },*/}
                          {/*              {*/}
                          {/*                  title: "Best shoes for long-distance running",*/}
                          {/*                  votes: 286,*/}
                          {/*                  comments: 93,*/}
                          {/*                  time: "1 week ago",*/}
                          {/*              },*/}
                          {/*              {*/}
                          {/*                  title: "Training plan for half marathon beginners",*/}
                          {/*                  votes: 197,*/}
                          {/*                  comments: 42,*/}
                          {/*                  time: "5 days ago",*/}
                          {/*              },*/}
                          {/*          ].map((relatedPost, index) => (*/}
                          {/*              <div*/}
                          {/*                  key={index}*/}
                          {/*                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-750"*/}
                          {/*              >*/}
                          {/*                  <Link*/}
                          {/*                      to={`/community/${post.communitySlug}/post/${relatedPost.id}`}*/}
                          {/*                      className="block"*/}
                          {/*                  >*/}
                          {/*                      <h4 className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">*/}
                          {/*                          {relatedPost.title}*/}
                          {/*                      </h4>*/}
                          {/*                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">*/}
                          {/*<span className="flex items-center">*/}
                          {/*  <svg*/}
                          {/*      className="w-3 h-3 mr-1"*/}
                          {/*      fill="currentColor"*/}
                          {/*      viewBox="0 0 20 20"*/}
                          {/*  >*/}
                          {/*    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />*/}
                          {/*  </svg>*/}
                          {/*    {relatedPost.votes}*/}
                          {/*</span>*/}
                          {/*                          <span className="mx-2">•</span>*/}
                          {/*                          <span className="flex items-center">*/}
                          {/*  <svg*/}
                          {/*      className="w-3 h-3 mr-1"*/}
                          {/*      fill="currentColor"*/}
                          {/*      viewBox="0 0 20 20"*/}
                          {/*  >*/}
                          {/*    <path*/}
                          {/*        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"*/}
                          {/*        clipRule="evenodd"*/}
                          {/*    />*/}
                          {/*  </svg>*/}
                          {/*                              {relatedPost.comments}*/}
                          {/*</span>*/}
                          {/*                          <span className="mx-2">•</span>*/}
                          {/*                          <span>{relatedPost.time}</span>*/}
                          {/*                      </div>*/}
                          {/*                  </Link>*/}
                          {/*              </div>*/}
                          {/*          ))}*/}
                          {/*      </div>*/}
                          {/*  </div>*/}

                            {/* Community info with stats */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        About Community
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Created on Apr 12, 2015. This community is dedicated to
                                        sharing experiences, tips, and advice related to running and
                                        jogging.
                                    </p>
                                    <div className="flex items-center text-sm mb-2">
                                        <svg
                                            className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                      Posts are moderated
                    </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <svg
                                            className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                      12 moderators
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );

    // Comment render function
    function renderComment(comment:any) {
        // Get the comment vote (0, 1, or -1)
        const commentVote = commentVotes[comment.id] || 0;
        const score = comment.likeCount + (commentVotes[comment.id] || 0);

        return (
            <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3"
            >
                <div className="flex items-start space-x-2">
                    {/* Author avatar */}
                    <div
                        className={`h-8 w-8 rounded-full overflow-hidden flex-shrink-0 ${
                            !comment.author.avatar ? "flex items-center justify-center" : ""
                        }`}
                        style={{
                            backgroundColor: !comment.author.avatar
                                ? getCommunityColor(comment.author.username)
                                : "transparent",
                        }}
                    >
                        {comment.author.avatar ? (
                            <img
                                src={comment.author.avatar}
                                alt={comment.author.username}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-medium text-sm">
                {comment.author.username.charAt(0).toUpperCase()}
              </span>
                        )}
                    </div>

                    {/* Comment content */}
                    <div className="flex-1 min-w-0">
                        {/* Comment header */}
                        <div className="flex items-center text-xs mb-1">
                            <Link
                                to={`/profile/${comment.author.username}`}
                                className="font-medium text-gray-900 dark:text-white hover:underline"
                            >
                                {comment.author.username}
                            </Link>
                            <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
                            <span
                                className="text-gray-500 dark:text-gray-400"
                                title={new Date(comment.createdAt).toLocaleString()}
                            >
                {formatRelativeTime(comment.createdAt)}
              </span>

                            {commentVote === 1 && (
                                <>
                  <span className="mx-1 text-gray-500 dark:text-gray-400">
                    •
                  </span>
                                    <span className="flex items-center text-orange-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 mr-0.5"
                    >
                      <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                      />
                    </svg>
                    Upvoted
                  </span>
                                </>
                            )}

                            {commentVote === -1 && (
                                <>
                  <span className="mx-1 text-gray-500 dark:text-gray-400">
                    •
                  </span>
                                    <span className="flex items-center text-blue-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 mr-0.5"
                    >
                      <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                      />
                    </svg>
                    Downvoted
                  </span>
                                </>
                            )}
                        </div>

                        {/* Comment text */}
                        <div className="text-sm text-gray-800 dark:text-white mb-2">
                            {comment.content}
                        </div>

                        {/* Comment actions */}
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            {/* Upvote button */}
                            <button
                                onClick={() => handleCommentVote(comment.id, "up")}
                                className={`p-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    commentVote === 1 ? "text-orange-500" : ""
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Vote count */}
                            <span
                                className={`mx-1 ${
                                    commentVote === 1
                                        ? "text-orange-500"
                                        : commentVote === -1
                                            ? "text-blue-500"
                                            : ""
                                }`}
                            >
                {score}
              </span>

                            {/* Downvote button */}
                            <button
                                onClick={() => handleCommentVote(comment.id, "down")}
                                className={`p-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    commentVote === -1 ? "text-blue-500" : ""
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Reply button */}
                            <button className="mx-2 hover:text-blue-500">Reply</button>

                            {/* Share button */}
                            <button className="mx-2 hover:text-blue-500">Share</button>

                            {/* Report button */}
                            <button className="mx-2 hover:text-blue-500">Report</button>

                            {/* Time */}
                            <span className="ml-auto">
                {formatRelativeTime(comment.createdAt)}
              </span>
                        </div>

                        {/* Nested replies would go here */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
                                {comment.replies.map((reply:any) => renderComment(reply))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
