"use client"
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunitySinglePost, setNewCommunityComment, setCommunityPostLike, setPollAnswer, setCommunityPostDelete, setCommunityPostEdit } from "@/store/slices/communityPostSlice";
import {fetchCommunity} from "@/store/slices/communityGroupsSlice";
import {RootState} from "@/store";
import api from "@/services/api";
import ImageZoomModal from "@/community/ImageZoomModal";

// Types - Backend response'a göre güncellenmiş
interface Author {
    username: string;
    avatar: string | null;
    userScore?: number;
    userType?: string;
    userRank?: {
        rank_no: number;
        rank_name: string;
        impact: number;
    };
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
    postType?: string;
    imageUrl?: any;
    postImage?:any;
    postPoll?: {
        poll_title: string;
        answers: string[];
    };
    postPollVoted?: number;
    contentEdited?: boolean;
}

// Helper function to get a consistent color for communities
const getCommunityColor = (name: string): string => {
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

export default function CommunityPost() {
    const { page } = useParams();
    const { post_id } = useParams();
    const dispatch = useDispatch() as any;
    const router = useRouter();

    const { communitySinglePostData } = useSelector((state: any) => state.communityPost);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const postIdStr = post_id as string;
    const communitySlugStr = page as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [postVote, setPostVote] = useState<number>(0);
    const [commentVotes, setCommentVotes] = useState<Record<string, number>>({});
    const [newComment, setNewComment] = useState<string>("");
    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const [likeLoading, setLikeLoading] = useState<boolean>(false);
    const [pollLoading, setPollLoading] = useState<boolean>(false);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    // Add new state for showing action menu
    const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
    const [showShareOptions, setShowShareOptions] = useState<boolean>(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);

    // Edit/Delete states
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [editPostTitle, setEditPostTitle] = useState<string>("");
    const [editPostContent, setEditPostContent] = useState<string>("");
    const [editPostType, setEditPostType] = useState<string>("text");
    const [editPollOptions, setEditPollOptions] = useState<string[]>(['', '']);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [editSelectedImageFile, setEditSelectedImageFile] = useState<File | null>(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState<boolean>(false);
    const loginUser = useSelector(
        (state: RootState) => state.usersAuth.loginUser
    );
    const currentUser =loginUser.user_name
    useEffect(() => {
        if (postIdStr) {
            dispatch(fetchCommunitySinglePost({
                post_id: postIdStr,
                project: {}
            }) as any);
        }
    }, [postIdStr, dispatch]);

    // Backend verisini state'e dönüştürme
    useEffect(() => {
        if (communitySinglePostData?.data) {
            const backendData = communitySinglePostData.data;

            const transformedPost: Post = {
                id: backendData.post_id,
                title: backendData.post_title,
                content: backendData.post_content,
                author: {
                    username: backendData.user_name,
                    avatar: backendData.user_profile_image !== "default.jpg" ? backendData.user_profile_image : null,
                    userScore: backendData.user_score,
                    userType: backendData.user_type,
                    userRank: backendData.user_rank
                },
                communitySlug: communitySlugStr,
                createdAt: backendData.created_date,
                likeCount: backendData.like_count,
                commentCount: backendData.comments?.length || 0,
                comments: backendData.comments || [],
                postType: backendData.post_type,
                postImage:backendData.post_image,
                postPoll: backendData.post_poll,
                postPollVoted: backendData.post_poll_voted,
                contentEdited: backendData.content_edited
            };

            setPost(transformedPost);
            setLoading(false);

            // Edit modalı için verileri hazırla
            setEditPostTitle(transformedPost.title);
            setEditPostContent(transformedPost.content);
            setEditPostType(transformedPost.postType || 'text');
            if (transformedPost.postPoll) {
                setEditPollOptions(transformedPost.postPoll.answers);
            }
        }
    }, [communitySinglePostData, communitySlugStr]);

    const { communityData } = useSelector((state: any) => state.communityGroups);
    const [community, setCommunity] = useState<any>(null);
    console.log(community,"communitycommunity")
    // console.log(communitySinglePostData,"communitySinglePostData")
    useEffect(() => {
        if (communitySinglePostData?.data?.post_method_community_id) {
            dispatch(fetchCommunity({
                community_id: communitySinglePostData.data.post_method_community_id,
                project: {}
            }) as any);
        }
    }, [communitySinglePostData, dispatch]);

    useEffect(() => {
        if (communityData?.data) {
            setCommunity(communityData.data);
            console.log("Community Data:", communityData.data);
        }
    }, [communityData]);

    // Function to close menus when clicking outside
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

    const formatRelativeTime = (dateString: string): string => {
        // Eğer backend'den "23 hours ago" gibi formatlanmış string geliyorsa direkt kullan
        if (dateString.includes("ago") || dateString.includes("hour") || dateString.includes("day")) {
            return dateString;
        }

        // Yoksa normal tarih formatlamayı yap
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

    const handlePostVote = async (value: number) => {
        if (!post || likeLoading) return;

        setLikeLoading(true);

        try {
            const result = await dispatch(setCommunityPostLike({
                post_id: post.id,
                project: {}
            }) as any);

            if (setCommunityPostLike.fulfilled.match(result)) {
                if (postVote === value) {
                    // If clicking the same vote button, remove the vote
                    setPostVote(0);
                    setPost((prev) => prev ? { ...prev, likeCount: prev.likeCount - value } : null);
                } else {
                    // If changing vote, adjust count by the difference
                    const diff = value - postVote;
                    setPostVote(value);
                    setPost((prev) => prev ? { ...prev, likeCount: prev.likeCount + diff } : null);
                }

                console.log("Vote successful:", result.payload);
            } else {
                console.error("Vote failed:", result.payload);
                // Error feedback burada eklenebilir
            }
        } catch (error) {
            console.error("Vote error:", error);
            // Error feedback burada eklenebilir
        } finally {
            setLikeLoading(false);
        }
    };

    const handleCommentVote = (commentId: string, direction: string) => {
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

    // Handle poll answer - Backend entegrasyonu
    const handlePollAnswer = async (answerIndex: number) => {
        if (!post || pollLoading || (post.postPollVoted !== undefined && post.postPollVoted !== 0)) return;
        if (!post || pollLoading || post.postPollVoted !== 0) return;
        setPollLoading(true);

        try {
            const result = await dispatch(setPollAnswer({
                post_id: post.id,
                answer_no: answerIndex + 1, // Backend 1-indexed bekliyor
                project: {}
            }) as any);

            if (setPollAnswer.fulfilled.match(result)) {
                console.log("Poll answer submitted successfully:", result.payload);

                // Post'u yeniden çek (güncel poll sonuçlarını almak için)
                await dispatch(fetchCommunitySinglePost({
                    post_id: post.id,
                    project: {}
                }) as any);

                console.log("Poll answer recorded!");

            } else {
                console.error("Poll answer submission failed:", result.payload);
                // Error feedback burada eklenebilir
            }

        } catch (error) {
            console.error("Poll answer error:", error);
            // Error feedback burada eklenebilir
        } finally {
            setPollLoading(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newComment.trim() || !post || commentLoading) return;

        setCommentLoading(true);

        try {
            const result = await dispatch(setNewCommunityComment({
                parent_post_id: post.id,
                post_content: newComment.trim(),
                project: {}
            }) as any);

            if (setNewCommunityComment.fulfilled.match(result)) {
                console.log("Comment submitted successfully:", result.payload);

                // Yorum başarılı olursa input'u temizle
                setNewComment("");

                // Post'u yeniden çek (güncel yorumları almak için)
                await dispatch(fetchCommunitySinglePost({
                    post_id: post.id,
                    project: {}
                }) as any);

                // Success feedback burada eklenebilir
                console.log("Comment added successfully!");

            } else {
                console.error("Comment submission failed:", result.payload);
                // Error feedback burada eklenebilir
            }

        } catch (error) {
            console.error("Comment submission error:", error);
            // Error feedback burada eklenebilir
        } finally {
            setCommentLoading(false);
        }
    };

    const handleEditPost = () => {
        setEditImagePreview(null);
        setEditSelectedImageFile(null);

        if (post) {
            setEditPostTitle(post.title);
            setEditPostContent(post.content);
            setEditPostType(post.postType || 'text');

            if (post.postPoll) {
                setEditPollOptions(post.postPoll.answers);
            }

            if (post.postType === 'image' && post.postImage && post.postImage !== 'default.jpg') {
                setEditImagePreview(post.postImage);
            }
        }

        setIsEditModalOpen(true);
        setShowActionMenu(false);
    };
    const handleEditPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!post || isSubmittingEdit) return;

        setIsSubmittingEdit(true);

        try {
            const result = await dispatch(setCommunityPostEdit({
                post_id: post.id,
                post_title:editPostTitle,
                post_content: editPostContent,
                project: {}
            }) as any);

            if (setCommunityPostEdit.fulfilled.match(result)) {
                console.log("Post edited successfully:", result.payload);

                // Post'u yeniden çek
                await dispatch(fetchCommunitySinglePost({
                    post_id: post.id,
                    project: {}
                }) as any);

                setIsEditModalOpen(false);
                console.log("Post updated successfully!");
            } else {
                console.error("Post edit failed:", result.payload);
            }
        } catch (error) {
            console.error("Post edit error:", error);
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    // Delete post functions
    const handleDeletePost = () => {
        setIsDeleteModalOpen(true);
        setShowActionMenu(false);
    };

    const handleDeletePostConfirm = async () => {
        if (!post || isSubmittingDelete) return;

        setIsSubmittingDelete(true);

        try {
            const result = await dispatch(setCommunityPostDelete({
                post_id: post.id,
                post_type: post.postType || 'text',
                project: {}
            }) as any);

            if (setCommunityPostDelete.fulfilled.match(result)) {
                console.log("Post deleted successfully:", result.payload);
                // Redirect to community page
                router.push(`/community/${post.communitySlug}`);
            } else {
                console.error("Post delete failed:", result.payload);
            }
        } catch (error) {
            console.error("Post delete error:", error);
        } finally {
            setIsSubmittingDelete(false);
        }
    };

    // Edit modal helper functions
    const updateEditPollOption = (index: number, value: string) => {
        const newOptions = [...editPollOptions];
        newOptions[index] = value;
        setEditPollOptions(newOptions);
    };

    const addEditPollOption = () => {
        if (editPollOptions.length < 6) {
            setEditPollOptions([...editPollOptions, '']);
        }
    };

    const removeEditPollOption = (index: number) => {
        if (editPollOptions.length > 2) {
            const newOptions = editPollOptions.filter((_, i) => i !== index);
            setEditPollOptions(newOptions);
        }
    };

    const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditSelectedImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Check if current user is the post author
    const isPostOwner = post?.author?.username === currentUser;
    // Comment render function
    const renderComment = (comment: any): JSX.Element => {
        // Backend'den gelen comment yapısına göre adapt et
        const commentVote = commentVotes[comment.post_id] || 0;
        const score = (comment.like_count || 0) + (commentVotes[comment.post_id] || 0);

        return (
            <div
                key={comment.post_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3"
            >
                <div className="flex items-start space-x-2">
                    {/* Author avatar */}
                    <div
                        className={`h-8 w-8 rounded-full overflow-hidden flex-shrink-0 ${
                            !comment.user_profile_image || comment.user_profile_image === "default.jpg" ? "flex items-center justify-center" : ""
                        }`}
                        style={{
                            backgroundColor: (!comment.user_profile_image || comment.user_profile_image === "default.jpg")
                                ? getCommunityColor(comment.user_name)
                                : "transparent",
                        }}
                    >
                        {comment.user_profile_image && comment.user_profile_image !== "default.jpg" ? (
                            <img
                                src={comment.user_profile_image}
                                alt={comment.user_name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-medium text-sm">
                                {comment.user_name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Comment header */}
                        <div className="flex items-center text-xs mb-1">
                            <Link
                                href={`/profile/${comment.user_name}`}
                                className="font-medium text-gray-900 dark:text-white hover:underline"
                            >
                                {comment.user_name}
                            </Link>
                            <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
                            <span
                                className="text-gray-500 dark:text-gray-400"
                                title={comment.updated_date}
                            >
                                {formatRelativeTime(comment.created_date || comment.updated_date)}
                            </span>

                            {commentVote === 1 && (
                                <>
                                    <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
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
                                    <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
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
                            {comment.post_content}
                        </div>

                        {/* Comment actions */}
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            {/* Upvote button */}
                            <button
                                onClick={() => handleCommentVote(comment.post_id, "up")}
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
                                onClick={() => handleCommentVote(comment.post_id, "down")}
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
                                {formatRelativeTime(comment.created_date || comment.updated_date)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!post) {
        return (
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Post not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Separate breadcrumb from navbar */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Link
                            href="/public"
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
                            href="/community"
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
                            href={`/community/${post.communitySlug}`}
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
                                {/* Desktop vote buttons */}
                                <div className="hidden md:flex flex-col items-center py-3 px-2 bg-gray-50 dark:bg-gray-700">
                                    <button
                                        onClick={() => handlePostVote(1)}
                                        disabled={likeLoading}
                                        className={`p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            postVote === 1 ? "text-orange-500" : ""
                                        }`}
                                    >
                                        {likeLoading ? (
                                            <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                                        ) : (
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
                                        )}
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
                                        disabled={likeLoading}
                                        className={`p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
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
                                            disabled={likeLoading}
                                            className={`p-1 mr-1 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                            disabled={likeLoading}
                                            className={`p-1 ml-1 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Post meta */}
                                    <div className="mb-3">
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            <Link
                                                href={`/community/${post.communitySlug}`}
                                                className="flex items-center font-medium text-gray-900 dark:text-white hover:underline mr-2"
                                            >
                                                <div
                                                    className="h-5 w-5 rounded-full mr-1 flex items-center justify-center text-white text-xs font-medium"
                                                    style={{
                                                        backgroundColor: getCommunityColor(post.communitySlug),
                                                    }}
                                                >
                                                    {post.communitySlug.charAt(0).toUpperCase()}
                                                </div>
                                                r/{post.communitySlug}
                                            </Link>
                                            <span className="mx-1">•</span>
                                            <span>Posted by</span>
                                            <Link
                                                href={`/profile/${post.author.username}`}
                                                className="font-medium hover:underline mx-1"
                                            >
                                                u/{post.author.username}
                                            </Link>
                                            {post.author.userRank && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                                        {post.author.userRank.rank_name}
                                                    </span>
                                                </>
                                            )}
                                            <span className="mx-1">•</span>
                                            <span>
                                                {formatRelativeTime(post.createdAt)}
                                            </span>
                                            {post.contentEdited && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <span className="text-orange-500">edited</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                                {post.title}
                                            </h1>

                                            {/* Action menu - moved to be inline with title */}
                                            <div className="relative ml-4">
                                                <button
                                                    className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400"
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
                                                        {isPostOwner && (
                                                            <>
                                                                <button
                                                                    onClick={handleEditPost}
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                                                >
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
                                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                        />
                                                                    </svg>
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={handleDeletePost}
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                                                >
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
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                        {!isPostOwner && (
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
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post content */}
                                    <div className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-6 break-words">
                                        {post.content}
                                    </div>

                                    {post.postType === "poll" && post.postPoll && (
                                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                                                {post.postPoll.poll_title}
                                            </h3>
                                            <div className="space-y-2">
                                                {post.postPoll.answers.map((answer, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePollAnswer(index)}
                                                        disabled={(post.postPollVoted ?? 0) !== 0 || pollLoading}
                                                        className={`w-full text-left p-3 rounded border transition-colors disabled:cursor-not-allowed ${
                                                            (post.postPollVoted ?? 0) === index + 1
                                                                ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
                                                                : (post.postPollVoted ?? 0) !== 0
                                                                    ? "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 opacity-50"
                                                                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{answer}</span>
                                                            {pollLoading && (
                                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                                                            )}
                                                            {(post.postPollVoted ?? 0) === index + 1 && (
                                                                <svg
                                                                    className="w-5 h-5 text-blue-500"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            {(post.postPollVoted ?? 0) !== 0 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                    You voted for: {post?.postPoll?.answers[(post?.postPollVoted ?? 1) - 1]}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {/* Image component (eğer post image ise) - BUNU EKLEYİN */}
                                    {post.postType === "image" && post.postImage && (
                                        <div className="mb-6">
                                            <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                <img
                                                    src={post.postImage}
                                                    alt={post.title}
                                                    className="w-full object-cover max-h-[600px]"
                                                    loading="lazy"
                                                    onClick={() =>
                                                        setZoomedImage(post.postImage || null)
                                                    }
                                                    // onError={(e) => {
                                                    //     console.error('Image load error:', post.postImage);
                                                    //     const target = e.target as HTMLImageElement;
                                                    //     target.style.display = 'none';
                                                    // }}
                                                />
                                            </div>
                                            {post.content && post.content.trim() !== '' && (
                                                <div className="mt-3 text-gray-800 dark:text-gray-200 text-sm">
                                                    {post.content}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {zoomedImage && (
                                        <ImageZoomModal
                                            imageUrl={zoomedImage}
                                            onClose={() => setZoomedImage(null)}
                                        />
                                    )}
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
                                            <span className="text-sm">{post.commentCount} Comments</span>
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comment form */}
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
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || commentLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {commentLoading ? (
                                            <>
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            "Comment"
                                        )}
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

                    {/* Redesigned right sidebar */}
                    {
                        community !== null && (
                            <aside className="hidden lg:block lg:col-span-4 space-y-4">
                                <div className="sticky top-4">
                                    {/* Community info card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">
                                        <div className="p-4">
                                            <div className="flex items-center mb-3">
                                                <div
                                                    className="h-10 w-10 rounded-full mr-3 flex items-center justify-center text-white text-base font-bold"
                                                    style={{
                                                        backgroundColor: getCommunityColor(post.communitySlug),
                                                    }}
                                                >
                                                    {(community?.community_name || post.communitySlug).charAt(0).toUpperCase()}
                                                </div>
                                                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {community?.community_name || `r/${post.communitySlug}`}
                                                </h2>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {community?.community_description || `A community for discussions about ${post.communitySlug}.`}
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-2 text-center mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {community?.total_member || '0'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Members
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {post?.author?.userScore}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        user score
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {post?.author?.userRank?.rank_no}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Ranking
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button className={`flex-1 py-2 font-medium rounded-md text-sm ${
                                                    community?.joined_status
                                                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}>
                                                    {community?.joined_status ? 'Joined' : 'Join'}
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

                                    {/*/!* Community rules *!/*/}
                                    {/*<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">*/}
                                    {/*    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">*/}
                                    {/*        <h3 className="font-medium text-gray-900 dark:text-white">*/}
                                    {/*            Community Rules*/}
                                    {/*        </h3>*/}
                                    {/*        <button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">*/}
                                    {/*            View All*/}
                                    {/*        </button>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="divide-y divide-gray-200 dark:divide-gray-700">*/}
                                    {/*        {[*/}
                                    {/*            "Remember the human",*/}
                                    {/*            "Behave like you would in real life",*/}
                                    {/*            "Look for the original source of content",*/}
                                    {/*        ].map((rule, index) => (*/}
                                    {/*            <div key={index} className="px-4 py-3">*/}
                                    {/*                <div className="flex items-center">*/}
                                    {/*                    <span className="mr-2 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 w-5 h-5 flex items-center justify-center text-gray-800 dark:text-gray-200">*/}
                                    {/*                        {index + 1}*/}
                                    {/*                    </span>*/}
                                    {/*                    <span className="text-sm text-gray-800 dark:text-gray-200">*/}
                                    {/*                        {rule}*/}
                                    {/*                    </span>*/}
                                    {/*                </div>*/}
                                    {/*            </div>*/}
                                    {/*        ))}*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    {/* Related posts,API YOK */}
                                    {/*  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">*/}
                                    {/*      <div className="p-3 border-b border-gray-200 dark:border-gray-700">*/}
                                    {/*          <h3 className="font-medium text-gray-900 dark:text-white">*/}
                                    {/*              Related Posts*/}
                                    {/*          </h3>*/}
                                    {/*      </div>*/}
                                    {/*      <div className="divide-y divide-gray-200 dark:divide-gray-700">*/}
                                    {/*          {[*/}
                                    {/*              {*/}
                                    {/*                  id: "1",*/}
                                    {/*                  title: "How to get started with running marathons?",*/}
                                    {/*                  votes: 432,*/}
                                    {/*                  comments: 57,*/}
                                    {/*                  time: "2 days ago",*/}
                                    {/*              },*/}
                                    {/*              {*/}
                                    {/*                  id: "2",*/}
                                    {/*                  title: "Best shoes for long-distance running",*/}
                                    {/*                  votes: 286,*/}
                                    {/*                  comments: 93,*/}
                                    {/*                  time: "1 week ago",*/}
                                    {/*              },*/}
                                    {/*              {*/}
                                    {/*                  id: "3",*/}
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
                                    {/*                      href={`/community/${post.communitySlug}/post/${relatedPost.id}`}*/}
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
                                                {community?.community_description && (
                                                    <>
                                                        {community.community_description}
                                                        <br /><br />
                                                    </>
                                                )}
                                                Created on {community?.created_date ? new Date(community.created_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'Unknown'}. This community is dedicated to
                                                sharing experiences, tips, and advice.
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
                                            Moderated by u/{community?.community_admin?.user_name || 'Admin'}
                                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                        )
                    }
                </div>
            </div>

            {/* Edit Post Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleEditPostSubmit} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Edit Post</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Title */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={editPostTitle}
                                    onChange={(e) => setEditPostTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Content based on post type */}
                            <div className="mb-4">
                                {editPostType === 'text' && (
                                    <div>
                                        <textarea
                                            placeholder="Text (optional)"
                                            value={editPostContent}
                                            onChange={(e) => setEditPostContent(e.target.value)}
                                            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                            rows={8}
                                        ></textarea>
                                    </div>
                                )}

                                {editPostType === 'image' && (
                                    <div className="animate-fadeIn">
                                        {editImagePreview ? (
                                            <div className="relative mb-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                                                <img
                                                    src={editImagePreview}
                                                    alt="Preview"
                                                    className="max-h-96 mx-auto"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditImagePreview(null);
                                                        setEditSelectedImageFile(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {/* Mevcut image'in üstüne "Change Image" butonu ekleyin */}
                                                <div className="absolute bottom-2 left-2">
                                                    <label className="inline-flex items-center px-3 py-1 bg-blue-500 bg-opacity-80 border border-transparent rounded-md font-medium text-white hover:bg-blue-600 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer text-xs">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Change Image
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleEditImageUpload}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Drag and drop an image, or</p>
                                                <label className="mt-3 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer text-sm">
                                                    <span>Upload</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleEditImageUpload}
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        <textarea
                                            placeholder="Caption (optional)"
                                            value={editPostContent}
                                            onChange={(e) => setEditPostContent(e.target.value)}
                                            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                            rows={3}
                                        ></textarea>
                                    </div>
                                )}

                                {editPostType === 'poll' && (
                                    <div>
                                        <div className="mb-4 space-y-3">
                                            {editPollOptions.map((option, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="text"
                                                        placeholder={`Option ${index + 1}`}
                                                        value={option}
                                                        onChange={(e) => updateEditPollOption(index, e.target.value)}
                                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {index > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEditPollOption(index)}
                                                            className="ml-2 text-gray-500 hover:text-red-500"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addEditPollOption}
                                            className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm mb-4"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Add Option
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                    disabled={isSubmittingEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    disabled={!editPostTitle.trim() || isSubmittingEdit}
                                >
                                    {isSubmittingEdit ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Post'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Delete Post
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete this post? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                                    disabled={isSubmittingDelete}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeletePostConfirm}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    disabled={isSubmittingDelete}
                                >
                                    {isSubmittingDelete ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}