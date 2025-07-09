// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import CommentInput from "@/community/CommentSection";
// import ImageZoomModal from "@/community/ImageZoomModal";
// import AuthModal from "@/components/modals/AuthModal";
// import { getCommunityColor, timeSince } from "@/lib/helper";
// import {
//     BackendPost,
//     TransformedPost,
//     User,
//     UserProfile,
// } from "@/lib/postInterface/post";
//
// interface Community {
//     community_id: string | number;
//     community_name: string;
//     community_description?: string;
//     total_member?: number;
//     growth?: string;
// }
//
// interface LoginUser {
//     user_id: string | number | null;
//     user_name: string;
// }
//
// interface CommunityPageClientProps {
//     initialPosts: BackendPost[];
//     totalCount: number;
//     popularCommunity: Community[];
//     whoToFollow: User[];
// }
//
// const transformBackendPost = (backendPost: BackendPost): TransformedPost => {
//     const transformedPost: TransformedPost = {
//         id: backendPost.post_id,
//         title:
//             backendPost.post_poll?.poll_title ||
//             backendPost.post_title ||
//             "Untitled Post",
//         content: backendPost.post_content,
//         post_image: backendPost.post_image,
//         type:
//             backendPost.post_type === "poll"
//                 ? "poll"
//                 : backendPost.post_type === "image"
//                     ? "image"
//                     : "text",
//         createdAt: backendPost.created_date,
//         likeCount: parseInt(String(backendPost.like_count)) || 0,
//         commentCount: backendPost.comments?.length || 0,
//         author: {
//             username: backendPost.user_name,
//             avatar:
//                 backendPost.user_profile_image !== "default.jpg"
//                     ? backendPost.user_profile_image
//                     : null,
//         },
//         communitySlug:
//             backendPost.community_info?.community_name?.toLowerCase() || "general",
//         communityName: backendPost.community_info?.community_name || "General",
//         comments: backendPost.comments || [],
//         userVote: undefined,
//     };
//
//     if (backendPost.post_type === "poll" && backendPost.post_poll) {
//         transformedPost.pollOptions =
//             backendPost.post_poll.answers?.map((answer, index) => {
//                 const answerCount =
//                     backendPost.post_poll_answers?.find(
//                         (a) => parseInt(String(a.answer_no)) === index
//                     )?.count || 0;
//
//                 return {
//                     id: `p${index + 1}`,
//                     text: answer,
//                     votes: parseInt(String(answerCount)),
//                 };
//             }) || [];
//
//         transformedPost.totalVotes = transformedPost.pollOptions.reduce(
//             (sum, option) => sum + option.votes,
//             0
//         );
//         transformedPost.votedOption = backendPost.post_poll_voted
//             ? `p${backendPost.post_poll_voted}`
//             : null;
//         transformedPost.pollEndsAt = new Date(
//             Date.now() + 1000 * 60 * 60 * 24 * 7
//         ).toISOString();
//     }
//
//     if (
//         backendPost.post_type === "image" &&
//         backendPost.post_image &&
//         backendPost.post_image !== "default.jpg"
//     ) {
//         transformedPost.imageUrl = backendPost.post_image;
//     }
//
//     return transformedPost;
// };
//
// export default function CommunityPageClient({
//                                                 initialPosts,
//                                                 totalCount,
//                                                 popularCommunity: initialPopularCommunity,
//                                                 whoToFollow: initialWhoToFollow,
//                                             }: CommunityPageClientProps) {
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const loadingRef = useRef<HTMLDivElement>(null);
//     console.log(initialPosts, "initialPostsinitialPostszoom");
//     // Authentication check
//     const isAuthenticated =
//         loginUser?.user_id !== null && loginUser?.user_id !== undefined;
//
//     // Infinite scroll states
//     const [posts, setPosts] = useState<TransformedPost[]>(
//         initialPosts?.map(transformBackendPost) || []
//     );
//     const [isLoading, setIsLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(initialPosts?.length < totalCount);
//     const [offset, setOffset] = useState(initialPosts?.length || 0);
//     const [zoomedImage, setZoomedImage] = useState<string | null>(null);
//     // Other states
//     const [loaded, setLoaded] = useState<boolean>(false);
//     const [expandedComments, setExpandedComments] = useState<(string | number)[]>(
//         []
//     );
//     const [newComment, setNewComment] = useState<string>("");
//     const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
//     const [newReply, setNewReply] = useState<string>("");
//     const [followStatus, setFollowStatus] = useState<{
//         [key: string]: "follow" | "following";
//     }>({});
//
//     // Modal states
//     const [showCreateCommunityModal, setShowCreateCommunityModal] =
//         useState<boolean>(false);
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
//
//     // Community creation states
//     const [newCommunityName, setNewCommunityName] = useState<string>("");
//     const [newCommunityDescription, setNewCommunityDescription] =
//         useState<string>("");
//     const [communityType, setCommunityType] = useState<string>("public");
//
//     // Data states
//     const [whoToFolllow, setWhoToFollow] = useState<User[]>(
//         initialWhoToFollow || []
//     );
//     const [userCommunityList, setUserCommunityList] = useState<Community[]>([]);
//     const [popularCommunity, setPopularCommunity] = useState<Community[]>(
//         initialPopularCommunity || []
//     );
//
//     // Post creation states
//     const [postType, setPostType] = useState<"text" | "image" | "poll">("text");
//     const [postTitle, setPostTitle] = useState<string>("");
//     const [postContent, setPostContent] = useState<string>("");
//     const [selectedCommunity, setSelectedCommunity] = useState<string>("");
//     const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
//     const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
//     const [isSubmittingPost, setIsSubmittingPost] = useState<boolean>(false);
//
//     // State for editing comments
//     const [editingCommentId, setEditingCommentId] = useState<
//         string | number | null
//     >(null);
//     const [editingCommentContent, setEditingCommentContent] =
//         useState<string>("");
//
//     // Load more posts function
//     // const loadMorePosts = useCallback(async () => {
//     //     if (isLoading || !hasMore) return;
//     //
//     //     setIsLoading(true);
//     //     try {
//     //         const result = await dispatch(
//     //             fetchCommunityPostList({
//     //                 community_id: 0,
//     //                 user_id: 0,
//     //                 hashtag_name: "",
//     //                 post_id: 0,
//     //                 limit: 10,
//     //                 offset: offset,
//     //                 project: {},
//     //             }) as any
//     //         );
//     //
//     //         if (result.payload?.data && Array.isArray(result.payload.data)) {
//     //             const newPosts = result.payload.data.map(transformBackendPost);
//     //
//     //             setPosts((prevPosts) => {
//     //                 // Duplicate post kontrolü
//     //                 const existingIds = new Set(prevPosts.map((post) => post.id));
//     //                 const uniqueNewPosts = newPosts.filter(
//     //                     (post: { id: string | number }) => !existingIds.has(post.id)
//     //                 );
//     //                 return [...prevPosts, ...uniqueNewPosts];
//     //             });
//     //
//     //             setOffset((prev) => prev + result.payload.data.length);
//     //
//     //             // Eğer gelen post sayısı 10'dan azsa, daha fazla post yok demektir
//     //             if (result.payload.data.length < 10) {
//     //                 setHasMore(false);
//     //             }
//     //         } else {
//     //             setHasMore(false);
//     //         }
//     //     } catch (error) {
//     //         console.error("❌ Load more posts error:", error);
//     //         setHasMore(false);
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // }, [dispatch, isLoading, hasMore, offset]);
//
//     // Intersection Observer for infinite scroll
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 const target = entries[0];
//                 if (target.isIntersecting && hasMore && !isLoading) {
//                     loadMorePosts();
//                 }
//             },
//             {
//                 threshold: 0.1,
//                 rootMargin: "100px",
//             }
//         );
//
//         const currentLoadingRef = loadingRef.current;
//         if (currentLoadingRef) {
//             observer.observe(currentLoadingRef);
//         }
//
//         return () => {
//             if (currentLoadingRef) {
//                 observer.unobserve(currentLoadingRef);
//             }
//         };
//     }, [hasMore, isLoading]);
//
//     // Get profile data on component mount
//     // useEffect(() => {
//     //     if (isAuthenticated) {
//     //         dispatch(getProfile({ project: {} }) as any);
//     //     }
//     // }, [dispatch, isAuthenticated]);
//     //
//     // const fetchUserCommunityList = async (): Promise<void> => {
//     //     if (!isAuthenticated) return;
//     //     try {
//     //         const result = await dispatch(fetchCommunityList({ project: {} }) as any);
//     //         setUserCommunityList(result?.payload?.data || []);
//     //     } catch (error) {
//     //         console.error("❌ User community list fetch error:", error);
//     //     }
//     // };
//
//     // Takip edilen kullanıcıları belirleme
//     useEffect(() => {
//         const fetchFollowedUsers = async (): Promise<void> => {
//             if (!isAuthenticated) return;
//             try {
//                 const result = await dispatch(
//                     fetchUserFollowedList({
//                         user_id: loginUser?.user_id || 0,
//                         limit: 100,
//                         offset: 0,
//                         project: {},
//                     }) as any
//                 );
//
//                 if (result.payload?.data) {
//                     const followedUserIds = result.payload.data.map(
//                         (user: User) => user.user_id
//                     );
//                     const newFollowStatus: { [key: string]: "follow" | "following" } = {};
//                     whoToFolllow.forEach((user) => {
//                         newFollowStatus[String(user?.user_id)] = followedUserIds.includes(
//                             user.user_id
//                         )
//                             ? "following"
//                             : "follow";
//                     });
//                     setFollowStatus(newFollowStatus);
//                 }
//             } catch (error) {
//                 console.log("Failure to fetch followed users:", error);
//             }
//         };
//
//         if (whoToFolllow.length > 0 && isAuthenticated) {
//             fetchFollowedUsers();
//         }
//     }, [whoToFolllow, loginUser, isAuthenticated]);
//
//     // Refresh posts after new post creation
//     const refreshPosts = useCallback(async () => {
//         try {
//             const result = await dispatch(
//                 fetchCommunityPostList({
//                     community_id: 0,
//                     user_id: 0,
//                     hashtag_name: "",
//                     post_id: 0,
//                     limit: offset + 10, // Mevcut post sayısını korumak için
//                     offset: 0,
//                     project: {},
//                 }) as any
//             );
//             console.log("result", result);
//             if (result.payload?.data) {
//                 console.log("result.payload.data", result.payload.data);
//                 const refreshedPosts =
//                     result.payload.data.data.map(transformBackendPost);
//                 console.log("refreshedPosts", refreshedPosts);
//                 setPosts(refreshedPosts);
//                 console.log("refreshedPosts.length", refreshedPosts.length);
//                 setOffset(refreshedPosts.length);
//             } else {
//                 console.log(
//                     Array.isArray(result.payload.data),
//                     "result.payload.data is not an array"
//                 );
//             }
//         } catch (error) {
//             console.error("❌ Post refresh error:", error);
//         }
//     }, [dispatch, offset]);
//
//     // Event handlers
//     const handleLike = async (
//         postId: string | number,
//         direction: "up" | "down"
//     ): Promise<void> => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         try {
//             const result = await dispatch(
//                 setCommunityPostLike({
//                     post_id: postId,
//                     project: {},
//                 }) as any
//             );
//
//             if (result.payload && result.payload.status === true) {
//                 // Optimistic update for better UX
//                 setPosts((prevPosts) =>
//                     prevPosts.map((post) =>
//                         post.id === postId
//                             ? {
//                                 ...post,
//                                 likeCount: post.likeCount + (direction === "up" ? 1 : -1),
//                             }
//                             : post
//                     )
//                 );
//                 console.log(
//                     `✅ Post successfully ${direction === "up" ? "liked" : "disliked"}!`
//                 );
//             }
//         } catch (error) {
//             console.error("❌ Error during Like operation:", error);
//         }
//     };
//
//     const handleCreatePost = async (
//         e: React.FormEvent<HTMLFormElement>
//     ): Promise<void> => {
//         e.preventDefault();
//
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         if (!postTitle.trim()) {
//             toast.error("Please fill in all required fields");
//             return;
//         }
//
//         setIsSubmittingPost(true);
//
//         try {
//             console.log("post created in here");
//             const selectedCommunityData = userCommunityList.find(
//                 (community) =>
//                     community.community_name.toLowerCase() === selectedCommunity
//             );
//
//             const communityId = selectedCommunityData?.community_id || 0;
//
//             let pollData: string | null = null;
//             if (postType === "poll") {
//                 const validPollOptions = pollOptions.filter(
//                     (option) => option.trim() !== ""
//                 );
//                 if (validPollOptions.length < 2) {
//                     toast.error("Poll must have at least 2 options");
//                     setIsSubmittingPost(false);
//                     return;
//                 }
//                 pollData = JSON.stringify({
//                     poll_title: postTitle,
//                     answers: validPollOptions,
//                 });
//             }
//
//             const postParams: any = {
//                 post_type: postType,
//                 post_method: "everyone",
//                 post_method_community_id: communityId || 0,
//                 post_title: postTitle,
//                 post_content:
//                     postType === "poll"
//                         ? postTitle
//                         : postContent
//                             ? "\n\n" + postContent
//                             : "",
//                 project: {},
//             };
//
//             if (pollData) {
//                 postParams.post_poll = pollData;
//             }
//
//             if (postType === "image" && selectedImageFile) {
//                 postParams.post_image = selectedImageFile;
//             }
//
//             const result = await dispatch(setNewCommunityPost(postParams) as any);
//
//             if (result.payload && result?.payload?.status === true) {
//                 toast.success("You shared your post successfully!");
//                 setPostTitle("");
//                 setPostContent("");
//                 setSelectedCommunity("");
//                 setPollOptions(["", ""]);
//                 setImagePreview(null);
//                 setSelectedImageFile(null);
//                 setPostType("text");
//                 setIsCreatingPost(false);
//                 setOffset(0);
//                 setHasMore(true);
//                 await refreshPosts();
//             } else {
//                 throw new Error(result.payload?.message || "Post could not created");
//             }
//         } catch (error: any) {
//             toast.error(error.message || "An unknown error occurred");
//             console.log("an occured post creation:", error);
//         } finally {
//             setIsSubmittingPost(false);
//         }
//     };
//
//     const handleCreateCommunity = async (
//         e: React.FormEvent<HTMLFormElement>
//     ): Promise<void> => {
//         e.preventDefault();
//
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         if (!newCommunityName.trim()) {
//             toast.error("Community name is required");
//             return;
//         }
//
//         try {
//             const result = await dispatch(
//                 setCommunityCreateCommunity({
//                     community_name: newCommunityName.trim(),
//                     community_description: newCommunityDescription.trim(),
//                     community_style: communityType,
//                     project: {},
//                 }) as any
//             );
//
//             if (result.payload && result.payload.status === "success") {
//                 console.log("✅ Community başarıyla oluşturuldu!");
//                 toast.success("Community created successfully!");
//
//                 await fetchUserCommunityList();
//
//                 setNewCommunityName("");
//                 setNewCommunityDescription("");
//                 setCommunityType("public");
//                 setShowCreateCommunityModal(false);
//             } else {
//                 console.log(
//                     "❌ Community oluşturma başarısız:",
//                     result.payload?.message || result.payload
//                 );
//                 toast.error("Failed to create community. Try again.");
//             }
//         } catch (error) {
//             console.log("❌ Community oluşturma sırasında hata:", error);
//             toast.error("Something went wrong. Try again later.");
//         }
//     };
//
//     const toggleComments = (postId: string | number): void => {
//         setExpandedComments((prev) => {
//             if (prev.includes(postId)) {
//                 return prev.filter((id) => id !== postId);
//             } else {
//                 return [...prev, postId];
//             }
//         });
//     };
//
//     const handleCommentVote = (
//         commentId: string | number,
//         direction: "up" | "down"
//     ): void => {
//         console.log(`Voted ${direction} on comment ${commentId}`);
//     };
//
//     const handleCommentSubmit = async (
//         content: string,
//         postId: string | number
//     ): Promise<void> => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         if (!content.trim()) return;
//
//         try {
//             const result = await dispatch(
//                 setNewCommunityComment({
//                     parent_post_id: postId,
//                     post_content: content.trim(),
//                     project: {},
//                 }) as any
//             );
//
//             if (result.payload && result.payload.status === true) {
//                 setNewComment("");
//                 await refreshPosts();
//                 toast.success("Comment added successfully!");
//             } else {
//                 throw new Error(
//                     result.payload?.message || "Comment could not be added"
//                 );
//             }
//         } catch (error) {
//             console.error("Comment submission error:", error);
//             toast.error("Failed to add comment. Try again.");
//         }
//     };
//     const handleReplyClick = (commentId: string | number): void => {
//         setReplyingTo(replyingTo === commentId ? null : commentId);
//         setNewReply("");
//     };
//
//     const handleReplySubmit = async (
//         content: string,
//         postId: string | number,
//         commentId: string | number
//     ): Promise<void> => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         if (!content.trim()) return;
//
//         try {
//             const result = await dispatch(
//                 setNewCommunityComment({
//                     parent_post_id: commentId,
//                     post_content: content.trim(),
//                     project: {},
//                 }) as any
//             );
//
//             if (result.payload && result.payload.status === true) {
//                 setNewReply("");
//                 setReplyingTo(null);
//                 await refreshPosts();
//                 toast.success("Reply added successfully!");
//             } else {
//                 throw new Error(result.payload?.message || "Reply could not be added");
//             }
//         } catch (error) {
//             console.error("Reply submission error:", error);
//             toast.error("Failed to add reply. Try again.");
//         }
//     };
//     const addPollOption = (): void => {
//         setPollOptions([...pollOptions, ""]);
//     };
//
//     const updatePollOption = (index: number, value: string): void => {
//         const newOptions = [...pollOptions];
//         newOptions[index] = value;
//         setPollOptions(newOptions);
//     };
//
//     const removePollOption = (index: number): void => {
//         if (pollOptions.length <= 2) return;
//         const newOptions = [...pollOptions];
//         newOptions.splice(index, 1);
//         setPollOptions(newOptions);
//     };
//
//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedImageFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//
//     const handlePollVote = async (
//         postId: string | number,
//         optionId: string
//     ): Promise<void> => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         try {
//             const answerNo = parseInt(optionId.replace("p", ""));
//
//             const result = await dispatch(
//                 setPollAnswer({
//                     post_id: postId,
//                     answer_no: answerNo,
//                     project: {},
//                 }) as any
//             );
//
//             if (result.payload && result.payload.status === true) {
//                 console.log("✅ Poll vote başarılı!");
//                 toast.success("Vote recorded successfully!");
//                 await refreshPosts();
//             } else {
//                 console.log(
//                     "❌ Poll vote başarısız:",
//                     result.payload?.message || result.payload
//                 );
//                 toast.error("Failed to record vote. Try again.");
//             }
//         } catch (error) {
//             console.log("❌ Poll vote sırasında hata:", error);
//             toast.error("Something went wrong. Try again later.");
//         }
//     };
//
//     const handleFollowUser = async (userId: string | number): Promise<void> => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//
//         try {
//             const response = await dispatch(
//                 setFollowOrUnFollow({
//                     user_id: userId,
//                     project: {},
//                 }) as any
//             );
//
//             if (response.payload?.status === true) {
//                 setFollowStatus((prev) => ({
//                     ...prev,
//                     [String(userId)]:
//                         prev[String(userId)] === "following" ? "follow" : "following",
//                 }));
//                 console.log("✅ Follow/Unfollow işlemi başarılı");
//                 toast.success(
//                     followStatus[String(userId)] === "following"
//                         ? "Unfollowed successfully!"
//                         : "Followed successfully!"
//                 );
//             } else {
//                 console.log(
//                     "❌ Follow/Unfollow işlemi başarısız:",
//                     response.payload?.message
//                 );
//                 toast.error("Follow action failed. Try again.");
//             }
//         } catch (error) {
//             console.error("Follow/unfollow error:", error);
//             toast.error("Something went wrong. Try again later.");
//         }
//     };
//
//     const handleCreatePostClick = (): void => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//         setIsCreatingPost(true);
//     };
//
//     const handleCreateCommunityClick = (): void => {
//         if (!isAuthenticated) {
//             setIsAuthModalOpen(true);
//             return;
//         }
//         setShowCreateCommunityModal(true);
//     };
//
//     useEffect(() => {
//         if (isAuthenticated) {
//             fetchUserCommunityList();
//         }
//         setLoaded(true);
//     }, [isAuthenticated]);
//
//     useEffect(() => {
//         if (communityPostLikeData) {
//             if (communityPostLikeData.status === "success") {
//                 console.log("✅ Like işlemi tamamlandı:", communityPostLikeData);
//             } else if (communityPostLikeData.status === "error") {
//                 console.error("❌ Like işlemi hatası:", communityPostLikeData.message);
//             }
//         }
//     }, [communityPostLikeData]);
//
//     // Edit button handler
//     const handleEditClick = (comment: any) => {
//         setEditingCommentId(comment.post_id);
//         setEditingCommentContent(comment.post_content);
//     };
//
//     // Save edit handler
//     const handleEditSave = async (
//         postId: string | number,
//         commentId: string | number
//     ) => {
//         if (!editingCommentContent.trim()) return;
//         const result = await dispatch(
//             Set_CommunityPostCommentEdit({
//                 post_id: postId, // <-- parametre adı düzeltildi
//                 post_content: editingCommentContent,
//                 project: {},
//             }) as any
//         );
//         if (result?.payload?.status) {
//             // Update comment in UI
//             setPosts((prevPosts) =>
//                 prevPosts.map((post) =>
//                     post.id === postId
//                         ? {
//                             ...post,
//                             comments: post.comments.map((c: any) =>
//                                 c.post_id === commentId
//                                     ? { ...c, post_content: editingCommentContent }
//                                     : c
//                             ),
//                         }
//                         : post
//                 )
//             );
//             setEditingCommentId(null);
//             setEditingCommentContent("");
//             toast.success("Comment updated.");
//         } else {
//             toast.error("Failed to update comment.");
//         }
//     };
//
//     // Cancel edit handler
//     const handleEditCancel = () => {
//         setEditingCommentId(null);
//         setEditingCommentContent("");
//     };
//
//     return (
//         <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
//             <div className="container mx-auto px-4 py-4 grid grid-cols-12 gap-4">
//                 {/* Left Sidebar */}
//                 <aside className="col-span-12 md:col-span-3 lg:col-span-2 space-y-4">
//                     {/* User profile box */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
//                         {isAuthenticated ? (
//                             <>
//                                 <div className="flex items-center space-x-3">
//                                     <div className="h-10 w-10 rounded-full overflow-hidden">
//                                         <img
//                                             src={
//                                                 userProfileData?.data?.user_profile_image &&
//                                                 userProfileData.data.user_profile_image !==
//                                                 "default.jpg"
//                                                     ? userProfileData.data.user_profile_image
//                                                     : "/default.jpg"
//                                             }
//                                             alt="Profile"
//                                             className="h-full w-full object-cover"
//                                             onError={(e) => {
//                                                 const target = e.target as HTMLImageElement;
//                                                 target.src = "/default.jpg";
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="flex-1">
//                                         <div className="font-medium text-gray-900 dark:text-white">
//                                             {loginUser?.user_name}
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div className="mt-3 flex justify-between items-center">
//                                     <div className="text-center flex-1">
//                                         <div className="text-sm font-medium text-gray-900 dark:text-white">
//                                             {userProfileData?.data?.total_posts || 0}
//                                         </div>
//                                         <div className="text-xs text-gray-600 dark:text-gray-300">
//                                             Posts
//                                         </div>
//                                     </div>
//                                     <div className="text-center flex-1 border-x border-gray-200 dark:border-gray-700">
//                                         <div className="text-sm font-medium text-gray-900 dark:text-white">
//                                             {userProfileData?.data?.total_comments || 0}
//                                         </div>
//                                         <div className="text-xs text-gray-600 dark:text-gray-300">
//                                             Comments
//                                         </div>
//                                     </div>
//                                     <div className="text-center flex-1">
//                                         <div className="text-sm font-medium text-gray-900 dark:text-white">
//                                             {userProfileData?.data?.total_likes || 0}
//                                         </div>
//                                         <div className="text-xs text-gray-600 dark:text-gray-300">
//                                             Likes
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="text-center py-4">
//                                 <div className="mb-4">
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                                     Join the Community
//                                 </h3>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                                     Sign in to share posts, comments and connect with others.
//                                 </p>
//                                 <button
//                                     onClick={() => setIsAuthModalOpen(true)}
//                                     className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//                                 >
//                                     Sign In / Sign Up
//                                 </button>
//                             </div>
//                         )}
//
//                         <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
//                             <nav>
//                                 <ul className="space-y-1">
//                                     <li>
//                                         <Link
//                                             href="/"
//                                             className="flex items-center px-3 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                                             </svg>
//                                             <span>Home</span>
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link
//                                             href="/news"
//                                             className="flex items-center px-3 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
//                                                     clipRule="evenodd"
//                                                 />
//                                                 <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
//                                             </svg>
//                                             <span>News</span>
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </nav>
//                         </div>
//                     </div>
//
//                     {/* Create Community button */}
//                     <button
//                         onClick={handleCreateCommunityClick}
//                         className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400 font-medium py-2.5 px-4 rounded-lg shadow flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-700"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-4 w-4 mr-2"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         Create Community
//                     </button>
//
//                     {/* Communities list */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mt-4">
//                         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                             <h3 className="font-medium text-gray-900 dark:text-white">
//                                 Your Communities
//                             </h3>
//                         </div>
//                         <nav className="p-2">
//                             {userCommunityList && userCommunityList.length > 0 ? (
//                                 <ul className="space-y-1">
//                                     {userCommunityList.map((community) => (
//                                         <li key={community.community_id}>
//                                             <Link
//                                                 href={`/community/${
//                                                     community.community_id
//                                                 }-${community.community_name.toLowerCase()}`}
//                                                 className="flex items-center px-3 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                                             >
//                                                 <div
//                                                     className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-white font-medium text-xs"
//                                                     style={{
//                                                         backgroundColor: getCommunityColor(
//                                                             community.community_name
//                                                         ),
//                                                     }}
//                                                 >
//                                                     {community.community_name.charAt(0)}
//                                                 </div>
//                                                 <span>r/{community.community_name}</span>
//                                             </Link>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                                     <p>You are not a member of any communities yet</p>
//                                 </div>
//                             )}
//                         </nav>
//                         <div className="p-3 border-t border-gray-200 dark:border-gray-700">
//                             <button
//                                 className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
//                                 onClick={() => router.push("/all-community-list")}
//                             >
//                                 See All Communities
//                             </button>
//                         </div>
//                     </div>
//                 </aside>
//
//                 {/* Main content */}
//                 <main className="col-span-12 md:col-span-9 lg:col-span-7">
//                     {/* Create Post card */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
//                         {!isCreatingPost ? (
//                             // Collapsed view
//                             <div className="p-2" onClick={handleCreatePostClick}>
//                                 <div className="flex items-center gap-2 p-2 cursor-pointer">
//                                     <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
//                                         {isAuthenticated ? (
//                                             <img
//                                                 src={
//                                                     userProfileData?.data?.user_profile_image &&
//                                                     userProfileData.data.user_profile_image !==
//                                                     "default.jpg"
//                                                         ? userProfileData.data.user_profile_image
//                                                         : "/default.jpg"
//                                                 }
//                                                 alt="User"
//                                                 className="h-full w-full object-cover"
//                                                 onError={(e) => {
//                                                     const target = e.target as HTMLImageElement;
//                                                     target.src = "/default.jpg";
//                                                 }}
//                                             />
//                                         ) : (
//                                             <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     className="h-5 w-5 text-white"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                 >
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth={2}
//                                                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full h-10 px-4 flex items-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
//                                         {isAuthenticated ? "Create Post" : "Sign in to create post"}
//                                     </div>
//                                 </div>
//
//                                 <div className="flex border-t border-gray-200 dark:border-gray-700 mt-1">
//                                     <button
//                                         className={`flex-1 flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md ${
//                                             !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             if (isAuthenticated) {
//                                                 handleCreatePostClick();
//                                                 setPostType("image");
//                                             } else {
//                                                 setIsAuthModalOpen(true);
//                                             }
//                                         }}
//                                         disabled={!isAuthenticated}
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-5 w-5 mr-2"
//                                             viewBox="0 0 20 20"
//                                             fill="currentColor"
//                                         >
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                         <span>Image</span>
//                                     </button>
//                                     <button
//                                         className={`flex-1 flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md ${
//                                             !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             if (isAuthenticated) {
//                                                 handleCreatePostClick();
//                                                 setPostType("poll");
//                                             } else {
//                                                 setIsAuthModalOpen(true);
//                                             }
//                                         }}
//                                         disabled={!isAuthenticated}
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-5 w-5 mr-2"
//                                             viewBox="0 0 20 20"
//                                             fill="currentColor"
//                                         >
//                                             <path d="M13 7H7v6h6V7z" />
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                         <span>Poll</span>
//                                     </button>
//                                     <button
//                                         className={`flex-1 flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md ${
//                                             !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             if (isAuthenticated) {
//                                                 handleCreatePostClick();
//                                                 setPostType("text");
//                                             } else {
//                                                 setIsAuthModalOpen(true);
//                                             }
//                                         }}
//                                         disabled={!isAuthenticated}
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-5 w-5 mr-2"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                             />
//                                         </svg>
//                                         <span>Post</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             // Expanded view - Post creation form
//                             <form onSubmit={handleCreatePost} className="p-4">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h2 className="text-lg font-medium text-gray-900 dark:text-white">
//                                         Create a post
//                                     </h2>
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setIsCreatingPost(false);
//                                             setPostTitle("");
//                                             setPostContent("");
//                                             setImagePreview(null);
//                                             setSelectedImageFile(null);
//                                             setPollOptions(["", ""]);
//                                             setPostType("text");
//                                         }}
//                                         className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-6 w-6"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={2}
//                                                 d="M6 18L18 6M6 6l12 12"
//                                             />
//                                         </svg>
//                                     </button>
//                                 </div>
//
//                                 {/* Community selector */}
//                                 <div className="mb-4">
//                                     <select
//                                         value={selectedCommunity}
//                                         onChange={(e) => setSelectedCommunity(e.target.value)}
//                                         className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">Choose a community</option>
//                                         {userCommunityList && userCommunityList.length > 0 ? (
//                                             userCommunityList.map((community) => (
//                                                 <option
//                                                     key={community.community_id}
//                                                     value={community.community_name.toLowerCase()}
//                                                 >
//                                                     r/{community.community_name}
//                                                 </option>
//                                             ))
//                                         ) : (
//                                             <option disabled>No communities available</option>
//                                         )}
//                                     </select>
//                                 </div>
//
//                                 {/* Post type tabs */}
//                                 <div className="flex border border-gray-200 dark:border-gray-700 rounded-md mb-4 overflow-hidden">
//                                     <button
//                                         type="button"
//                                         onClick={() => setPostType("text")}
//                                         className={`flex-1 py-2 px-4 font-medium text-sm ${
//                                             postType === "text"
//                                                 ? "bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500"
//                                                 : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
//                                         }`}
//                                     >
//                                         <div className="flex items-center justify-center">
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-5 w-5 mr-1"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                                 />
//                                             </svg>
//                                             Post
//                                         </div>
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setPostType("image")}
//                                         className={`flex-1 py-2 px-4 font-medium text-sm ${
//                                             postType === "image"
//                                                 ? "bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500"
//                                                 : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
//                                         }`}
//                                     >
//                                         <div className="flex items-center justify-center">
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-5 w-5 mr-1"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                                 />
//                                             </svg>
//                                             Image
//                                         </div>
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setPostType("poll")}
//                                         className={`flex-1 py-2 px-4 font-medium text-sm ${
//                                             postType === "poll"
//                                                 ? "bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500"
//                                                 : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
//                                         }`}
//                                     >
//                                         <div className="flex items-center justify-center">
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-5 w-5 mr-1"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                                                 />
//                                             </svg>
//                                             Poll
//                                         </div>
//                                     </button>
//                                 </div>
//
//                                 {/* Title */}
//                                 <div className="mb-4">
//                                     <input
//                                         type="text"
//                                         placeholder="Title"
//                                         value={postTitle}
//                                         onChange={(e) => setPostTitle(e.target.value)}
//                                         className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         required
//                                     />
//                                 </div>
//
//                                 {/* Content based on selected type */}
//                                 <div className="mb-4">
//                                     {/* Text post content */}
//                                     {postType === "text" && (
//                                         <div>
//                       <textarea
//                           placeholder="Text (optional)"
//                           value={postContent}
//                           onChange={(e) => setPostContent(e.target.value)}
//                           className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                           rows={8}
//                       ></textarea>
//                                         </div>
//                                     )}
//
//                                     {/* Image post content */}
//                                     {postType === "image" && (
//                                         <div>
//                                             {imagePreview ? (
//                                                 <div className="relative mb-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
//                                                     <img
//                                                         src={imagePreview}
//                                                         alt="Preview"
//                                                         className="max-h-96 mx-auto"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => {
//                                                             setImagePreview(null);
//                                                             setSelectedImageFile(null);
//                                                         }}
//                                                         className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
//                                                     >
//                                                         <svg
//                                                             xmlns="http://www.w3.org/2000/svg"
//                                                             className="h-5 w-5"
//                                                             viewBox="0 0 20 20"
//                                                             fill="currentColor"
//                                                         >
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                                                                 clipRule="evenodd"
//                                                             />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center mb-4">
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         className="mx-auto h-12 w-12 text-gray-400"
//                                                         fill="none"
//                                                         viewBox="0 0 24 24"
//                                                         stroke="currentColor"
//                                                     >
//                                                         <path
//                                                             strokeLinecap="round"
//                                                             strokeLinejoin="round"
//                                                             strokeWidth={2}
//                                                             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                                         />
//                                                     </svg>
//                                                     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                                                         Drag and drop an image, or
//                                                     </p>
//                                                     <label className="mt-3 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer text-sm">
//                                                         <span>Upload</span>
//                                                         <input
//                                                             type="file"
//                                                             className="hidden"
//                                                             accept="image/*"
//                                                             onChange={handleImageUpload}
//                                                         />
//                                                     </label>
//                                                 </div>
//                                             )}
//
//                                             <textarea
//                                                 placeholder="Caption (optional)"
//                                                 value={postContent}
//                                                 onChange={(e) => setPostContent(e.target.value)}
//                                                 className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                                                 rows={3}
//                                             ></textarea>
//                                         </div>
//                                     )}
//
//                                     {/* Poll post content */}
//                                     {postType === "poll" && (
//                                         <div>
//                                             <div className="mb-4 space-y-3">
//                                                 {pollOptions.map((option, index) => (
//                                                     <div key={index} className="flex items-center">
//                                                         <input
//                                                             type="text"
//                                                             placeholder={`Option ${index + 1}`}
//                                                             value={option}
//                                                             onChange={(e) =>
//                                                                 updatePollOption(index, e.target.value)
//                                                             }
//                                                             className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                         />
//                                                         {index > 1 && (
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => removePollOption(index)}
//                                                                 className="ml-2 text-gray-500 hover:text-red-500"
//                                                             >
//                                                                 <svg
//                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                     className="h-5 w-5"
//                                                                     viewBox="0 0 20 20"
//                                                                     fill="currentColor"
//                                                                 >
//                                                                     <path
//                                                                         fillRule="evenodd"
//                                                                         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                                                                         clipRule="evenodd"
//                                                                     />
//                                                                 </svg>
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//
//                                             <button
//                                                 type="button"
//                                                 onClick={addPollOption}
//                                                 className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm mb-4"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     className="h-5 w-5 mr-1"
//                                                     viewBox="0 0 20 20"
//                                                     fill="currentColor"
//                                                 >
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                                                         clipRule="evenodd"
//                                                     />
//                                                 </svg>
//                                                 Add Option
//                                             </button>
//
//                                             <div className="flex items-center mb-2">
//                                                 <div className="flex-1">
//                                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                                         Poll Length
//                                                     </label>
//                                                     <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
//                                                         <option value="1">1 Day</option>
//                                                         <option value="3">3 Days</option>
//                                                         <option value="7" defaultValue="7">
//                                                             7 Days
//                                                         </option>
//                                                         <option value="30">30 Days</option>
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//
//                                 {/* Action buttons */}
//                                 <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setIsCreatingPost(false);
//                                             setPostTitle("");
//                                             setPostContent("");
//                                             setImagePreview(null);
//                                             setSelectedImageFile(null);
//                                             setPollOptions(["", ""]);
//                                             setPostType("text");
//                                         }}
//                                         className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
//                                         disabled={isSubmittingPost}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                                         disabled={!postTitle.trim() || isSubmittingPost}
//                                     >
//                                         {isSubmittingPost ? (
//                                             <>
//                                                 <svg
//                                                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                 >
//                                                     <circle
//                                                         className="opacity-25"
//                                                         cx="12"
//                                                         cy="12"
//                                                         r="10"
//                                                         stroke="currentColor"
//                                                         strokeWidth="4"
//                                                     ></circle>
//                                                     <path
//                                                         className="opacity-75"
//                                                         fill="currentColor"
//                                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                                     ></path>
//                                                 </svg>
//                                                 Posting...
//                                             </>
//                                         ) : (
//                                             "Post"
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>
//                         )}
//                     </div>
//
//                     {/* Posts Container */}
//                     <div className="space-y-4">
//                         {posts?.length === 0 ? (
//                             <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
//                                 <div className="text-gray-500 dark:text-gray-400 text-lg">
//                                     {loaded ? "No posts available" : "Loading posts..."}
//                                 </div>
//                             </div>
//                         ) : (
//                             posts?.map((post) => (
//                                 <div
//                                     key={post.id}
//                                     className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4"
//                                 >
//                                     <div className="flex">
//                                         {/* Post vote buttons */}
//                                         <div className="flex flex-col items-center mr-4">
//                                             <button
//                                                 onClick={() => handleLike(post.id, "up")}
//                                                 className="text-gray-400 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="currentColor"
//                                                     className="w-6 h-6"
//                                                 >
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
//                                                         clipRule="evenodd"
//                                                     />
//                                                 </svg>
//                                             </button>
//
//                                             <span className="text-sm font-medium my-1 text-gray-800 dark:text-white">
//                         {post.likeCount}
//                       </span>
//
//                                             <button
//                                                 onClick={() => handleLike(post.id, "down")}
//                                                 className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="currentColor"
//                                                     className="w-6 h-6"
//                                                 >
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 011.06 1.06l-7.5 7.5z"
//                                                         clipRule="evenodd"
//                                                     />
//                                                 </svg>
//                                             </button>
//                                         </div>
//
//                                         {/* Post content area */}
//                                         <div className="flex-1">
//                                             {/* Post header */}
//                                             <div className="flex items-center mb-3">
//                                                 <div
//                                                     className="h-10 w-10 rounded-full overflow-hidden mr-3 flex items-center justify-center text-white font-medium"
//                                                     style={{
//                                                         backgroundColor: getCommunityColor(
//                                                             post.communitySlug
//                                                         ),
//                                                     }}
//                                                 >
//                                                     {post.communityName.charAt(0)}
//                                                 </div>
//                                                 <div>
//                                                     <Link
//                                                         href={`/community/${post.communitySlug}`}
//                                                         className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
//                                                     >
//                                                         r/{post.communitySlug}
//                                                     </Link>
//                                                     <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//                                                         <span>Posted by u/{post.author.username}</span>
//                                                         <span className="mx-1">•</span>
//                                                         <span>{timeSince(post.createdAt)}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//
//                                             {/* Post title */}
//                                             <Link
//                                                 href={`/community/${post.communitySlug}/post/${post.id}`}
//                                                 className="group"
//                                             >
//                                                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 mb-2">
//                                                     {post.title}
//                                                 </h2>
//                                             </Link>
//
//                                             {/* Post content based on type */}
//                                             {!post.type && post.content && (
//                                                 <div className="text-gray-800 dark:text-gray-200 mb-4">
//                                                     {post.content}
//                                                 </div>
//                                             )}
//
//                                             {/* Poll content */}
//                                             {post.type === "poll" && post.pollOptions && (
//                                                 <div className="mb-4">
//                                                     <div className="space-y-2">
//                                                         {post.pollOptions.map((option) => {
//                                                             const percentage =
//                                                                 Math.round(
//                                                                     (option.votes / (post.totalVotes || 1)) * 100
//                                                                 ) || 0;
//                                                             const isVoted = post.votedOption === option.id;
//
//                                                             return (
//                                                                 <button
//                                                                     key={option.id}
//                                                                     onClick={() =>
//                                                                         !post.votedOption &&
//                                                                         handlePollVote(post.id, option.id)
//                                                                     }
//                                                                     disabled={post.votedOption !== null}
//                                                                     className={`w-full p-3 border ${
//                                                                         isVoted
//                                                                             ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                                                                             : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
//                                                                     } rounded-md relative overflow-hidden transition-colors`}
//                                                                 >
//                                                                     {/* Background progress bar */}
//                                                                     {post.votedOption !== null && (
//                                                                         <div
//                                                                             className="absolute top-0 left-0 bottom-0 bg-blue-100 dark:bg-blue-900/30 z-0 transition-all duration-500"
//                                                                             style={{ width: `${percentage}%` }}
//                                                                         ></div>
//                                                                     )}
//
//                                                                     {/* Option text and votes */}
//                                                                     <div className="flex justify-between items-center relative z-10">
//                                     <span className="font-medium text-gray-900 dark:text-white">
//                                       {option.text}
//                                     </span>
//                                                                         {post.votedOption !== null && (
//                                                                             <span className="text-sm text-gray-700 dark:text-gray-300">
//                                         {percentage}% ({option.votes})
//                                       </span>
//                                                                         )}
//                                                                     </div>
//                                                                 </button>
//                                                             );
//                                                         })}
//                                                     </div>
//
//                                                     <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
//                                                         <span>{post.totalVotes || 0} votes</span>
//                                                         {post.pollEndsAt && (
//                                                             <span>
//                                 Poll ends{" "}
//                                                                 {new Date(post.pollEndsAt).toLocaleDateString()}
//                               </span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}
//
//                                             {/* Image content */}
//                                             {post.type === "image" && post.imageUrl && (
//                                                 <div className="mb-4">
//                                                     {post.content && (
//                                                         <div className="text-gray-800 dark:text-gray-200 mb-3">
//                                                             {post.content}
//                                                         </div>
//                                                     )}
//                                                     {zoomedImage && (
//                                                         <ImageZoomModal
//                                                             imageUrl={zoomedImage}
//                                                             onClose={() => setZoomedImage(null)}
//                                                         />
//                                                     )}
//
//                                                     <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-zoom-in">
//                                                         <img
//                                                             src={post.imageUrl}
//                                                             alt={post.title}
//                                                             className="w-full object-cover max-h-[600px] transition-transform hover:scale-105"
//                                                             onClick={() =>
//                                                                 setZoomedImage(post?.imageUrl || null)
//                                                             }
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             )}
//
//                                             {/* Text content */}
//                                             {post.type === "text" && post.content && (
//                                                 <div className="text-gray-800 dark:text-gray-200 mb-4">
//                                                     {post.content}
//                                                 </div>
//                                             )}
//
//                                             {/* Post actions */}
//                                             <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
//                                                 <button
//                                                     className={`flex items-center mr-4 ${
//                                                         expandedComments.includes(post.id)
//                                                             ? "text-blue-500 dark:text-blue-400"
//                                                             : ""
//                                                     }`}
//                                                     onClick={() => toggleComments(post.id)}
//                                                 >
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         className="h-5 w-5 mr-1"
//                                                         fill="none"
//                                                         viewBox="0 0 24 24"
//                                                         stroke="currentColor"
//                                                     >
//                                                         <path
//                                                             strokeLinecap="round"
//                                                             strokeLinejoin="round"
//                                                             strokeWidth={2}
//                                                             d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                                                         />
//                                                     </svg>
//                                                     <span>{post.commentCount} Comments</span>
//                                                 </button>
//                                             </div>
//
//                                             {/* Comments section */}
//                                             {expandedComments.includes(post.id) && (
//                                                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                                                     {/* Comment form */}
//                                                     <CommentInput
//                                                         onSubmit={(content: string) =>
//                                                             handleCommentSubmit(content, post.id)
//                                                         }
//                                                         placeholder={
//                                                             isAuthenticated
//                                                                 ? "Write a comment..."
//                                                                 : "Please login to comment"
//                                                         }
//                                                         disabled={!isAuthenticated}
//                                                         buttonText="Comment"
//                                                         showAvatar={isAuthenticated}
//                                                         userName={loginUser?.user_name}
//                                                         avatarUrl={
//                                                             userProfileData?.data?.user_profile_image &&
//                                                             userProfileData.data.user_profile_image !==
//                                                             "default.jpg"
//                                                                 ? userProfileData.data.user_profile_image
//                                                                 : "/default.jpg"
//                                                         }
//                                                     />
//
//                                                     {/* Comments list */}
//                                                     <div className="bg-white dark:bg-gray-800">
//                                                         {post?.comments && post?.comments?.length > 0 ? (
//                                                             post?.comments?.map((comment, commentIndex) => (
//                                                                 <div
//                                                                     key={`${
//                                                                         comment.post_id || comment.user_name
//                                                                     }-${commentIndex}`}
//                                                                     className="border-t border-gray-200 dark:border-gray-700"
//                                                                 >
//                                                                     <div className="p-4">
//                                                                         {/* Comment header */}
//                                                                         <div className="flex items-center mb-2">
//                                                                             {/* User avatar */}
//                                                                             <div className="h-8 w-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
//                                                                                 <img
//                                                                                     src={
//                                                                                         comment.user_profile_image &&
//                                                                                         comment.user_profile_image !==
//                                                                                         "default.jpg"
//                                                                                             ? comment.user_profile_image
//                                                                                             : "/default.jpg"
//                                                                                     }
//                                                                                     alt={comment.user_name}
//                                                                                     className="h-full w-full object-cover"
//                                                                                     onError={(e) => {
//                                                                                         const target =
//                                                                                             e.target as HTMLImageElement;
//                                                                                         target.src = "/default.jpg";
//                                                                                     }}
//                                                                                 />
//                                                                             </div>
//
//                                                                             {/* User info */}
//                                                                             <div className="flex items-center text-sm">
//                                                                                 <Link
//                                                                                     href={`/profile/${comment.user_name}`}
//                                                                                     className="font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
//                                                                                 >
//                                                                                     u/{comment.user_name}
//                                                                                 </Link>
//                                                                                 <span className="mx-1 text-gray-500 dark:text-gray-400">
//                                           •
//                                         </span>
//                                                                                 <span className="text-gray-500 dark:text-gray-400">
//                                           {timeSince(comment.created_date)}
//                                         </span>
//                                                                             </div>
//                                                                         </div>
//
//                                                                         {/* Comment content */}
//                                                                         <div className="ml-11">
//                                                                             {editingCommentId === comment.post_id ? (
//                                                                                 <div className="mb-3">
//                                           <textarea
//                                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
//                                               rows={3}
//                                               value={editingCommentContent}
//                                               onChange={(e) =>
//                                                   setEditingCommentContent(
//                                                       e.target.value
//                                                   )
//                                               }
//                                               autoFocus
//                                           />
//                                                                                     <div className="flex gap-2 justify-end">
//                                                                                         <button
//                                                                                             className="px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
//                                                                                             onClick={() =>
//                                                                                                 handleEditSave(
//                                                                                                     post.id,
//                                                                                                     comment.post_id
//                                                                                                 )
//                                                                                             }
//                                                                                         >
//                                                                                             Save
//                                                                                         </button>
//                                                                                         <button
//                                                                                             className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
//                                                                                             onClick={handleEditCancel}
//                                                                                         >
//                                                                                             Cancel
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             ) : (
//                                                                                 <p className="text-gray-800 dark:text-gray-200 text-sm mb-3">
//                                                                                     {comment.post_content}
//                                                                                 </p>
//                                                                             )}
//
//                                                                             {/* Comment actions */}
//                                                                             <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
//                                                                                 {/* Vote buttons */}
//                                                                                 {/*<div className="flex items-center space-x-1">*/}
//                                                                                 {/*    <button*/}
//                                                                                 {/*        onClick={() => handleCommentVote(comment.post_id, 'up')}*/}
//                                                                                 {/*        className="hover:text-orange-500 dark:hover:text-orange-400 p-1"*/}
//                                                                                 {/*    >*/}
//                                                                                 {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">*/}
//                                                                                 {/*            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L10 4.414 4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />*/}
//                                                                                 {/*        </svg>*/}
//                                                                                 {/*    </button>*/}
//
//                                                                                 {/*       <span className="px-1 text-gray-700 dark:text-gray-300 font-medium">*/}
//                                                                                 {/*        {comment.like_count || 0}*/}
//                                                                                 {/*    </span>*/}
//
//                                                                                 {/*    <button*/}
//                                                                                 {/*        onClick={() => handleCommentVote(comment.post_id, 'down')}*/}
//                                                                                 {/*        className="hover:text-blue-500 dark:hover:text-blue-400 p-1"*/}
//                                                                                 {/*    >*/}
//                                                                                 {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">*/}
//                                                                                 {/*            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 15.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />*/}
//                                                                                 {/*        </svg>*/}
//                                                                                 {/*    </button>*/}
//                                                                                 {/*</div>*/}
//
//                                                                                 {/* Edit button sadece kendi yorumunda */}
//                                                                                 {loginUser?.user_name &&
//                                                                                     comment.user_name ==
//                                                                                     loginUser.user_name && (
//                                                                                         <button
//                                                                                             onClick={() =>
//                                                                                                 handleEditClick(comment)
//                                                                                             }
//                                                                                             className="hover:text-blue-500 dark:hover:text-blue-400 font-medium"
//                                                                                         >
//                                                                                             Edit
//                                                                                         </button>
//                                                                                     )}
//                                                                                 <button
//                                                                                     onClick={() =>
//                                                                                         handleReplyClick(comment.post_id)
//                                                                                     }
//                                                                                     className="hover:text-blue-500 dark:hover:text-blue-400 font-medium"
//                                                                                 >
//                                                                                     Reply
//                                                                                 </button>
//
//                                                                                 {/* Share button */}
//                                                                                 {/*<button className="hover:text-blue-500 dark:hover:text-blue-400">*/}
//                                                                                 {/*    Share*/}
//                                                                                 {/*</button>*/}
//
//                                                                                 {/*/!* Report button *!/*/}
//                                                                                 {/*<button className="hover:text-red-500 dark:hover:text-red-400">*/}
//                                                                                 {/*    Report*/}
//                                                                                 {/*</button>*/}
//                                                                             </div>
//
//                                                                             {/* Reply form */}
//                                                                             {replyingTo === comment.post_id && (
//                                                                                 <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
//                                                                                     <CommentInput
//                                                                                         onSubmit={(content: string) =>
//                                                                                             handleReplySubmit(
//                                                                                                 content,
//                                                                                                 post.id,
//                                                                                                 comment.post_id
//                                                                                             )
//                                                                                         }
//                                                                                         placeholder={`Reply to u/${comment.user_name}...`}
//                                                                                         disabled={!isAuthenticated}
//                                                                                         buttonText="Reply"
//                                                                                         showAvatar={isAuthenticated}
//                                                                                         userName={loginUser?.user_name}
//                                                                                         avatarUrl={
//                                                                                             userProfileData?.data
//                                                                                                 ?.user_profile_image &&
//                                                                                             userProfileData.data
//                                                                                                 .user_profile_image !==
//                                                                                             "default.jpg"
//                                                                                                 ? userProfileData.data
//                                                                                                     .user_profile_image
//                                                                                                 : "/default.jpg"
//                                                                                         }
//                                                                                         autoFocus={true}
//                                                                                     />
//                                                                                     <div className="mt-2 flex justify-end">
//                                                                                         <button
//                                                                                             type="button"
//                                                                                             onClick={() =>
//                                                                                                 setReplyingTo(null)
//                                                                                             }
//                                                                                             className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
//                                                                                         >
//                                                                                             Cancel
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             ))
//                                                         ) : (
//                                                             <div className="p-4 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
//                                                                 <div className="flex flex-col items-center">
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2"
//                                                                         fill="none"
//                                                                         viewBox="0 0 24 24"
//                                                                         stroke="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             strokeLinecap="round"
//                                                                             strokeLinejoin="round"
//                                                                             strokeWidth={2}
//                                                                             d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                                                                         />
//                                                                     </svg>
//                                                                     <p className="text-sm">No comments yet.</p>
//                                                                     <p className="text-xs text-gray-400 dark:text-gray-500">
//                                                                         Be the first to comment!
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//
//                         {/* Infinite scroll loading trigger */}
//                         {hasMore && (
//                             <div
//                                 ref={loadingRef}
//                                 className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
//                             >
//                                 {isLoading ? (
//                                     <div className="flex items-center justify-center">
//                                         <svg
//                                             className="animate-spin h-8 w-8 text-blue-500"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <circle
//                                                 className="opacity-25"
//                                                 cx="12"
//                                                 cy="12"
//                                                 r="10"
//                                                 stroke="currentColor"
//                                                 strokeWidth="4"
//                                             ></circle>
//                                             <path
//                                                 className="opacity-75"
//                                                 fill="currentColor"
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                             ></path>
//                                         </svg>
//                                         <span className="ml-2 text-gray-600 dark:text-gray-400">
//                       Loading more posts...
//                     </span>
//                                     </div>
//                                 ) : (
//                                     <div className="text-gray-400 dark:text-gray-500">
//                                         Scroll down to load more posts
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//
//                         {/* End of posts message */}
//                         {!hasMore && posts?.length > 0 && (
//                             <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
//                                 <div className="text-gray-500 dark:text-gray-400">
//                                     🎉 You've reached the end! No more posts to load.
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </main>
//
//                 {/* Right Sidebar */}
//                 <aside className="hidden lg:block lg:col-span-3 space-y-4">
//                     {/* Popular Communities widget */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                             <h3 className="font-medium text-gray-900 dark:text-white">
//                                 Popular Communities
//                             </h3>
//                         </div>
//                         <div className="p-4">
//                             <ul className="space-y-3">
//                                 {Array.isArray(popularCommunity) &&
//                                 popularCommunity.length > 0 ? (
//                                     popularCommunity.map((community) => {
//                                         const firstChar = community.community_name
//                                             .charAt(0)
//                                             .toLowerCase();
//                                         let bgColorClass = "bg-blue-500";
//
//                                         if (["a", "b", "c"].includes(firstChar))
//                                             bgColorClass = "bg-red-500";
//                                         else if (["d", "e", "f"].includes(firstChar))
//                                             bgColorClass = "bg-green-500";
//                                         else if (["g", "h", "i"].includes(firstChar))
//                                             bgColorClass = "bg-purple-500";
//                                         else if (["j", "k", "l"].includes(firstChar))
//                                             bgColorClass = "bg-yellow-500";
//                                         else if (["m", "n", "o"].includes(firstChar))
//                                             bgColorClass = "bg-indigo-500";
//                                         else if (["p", "q", "r"].includes(firstChar))
//                                             bgColorClass = "bg-pink-500";
//                                         else if (["s", "t", "u"].includes(firstChar))
//                                             bgColorClass = "bg-green-500";
//                                         else if (["v", "w", "x"].includes(firstChar))
//                                             bgColorClass = "bg-orange-500";
//                                         else if (["y", "z"].includes(firstChar))
//                                             bgColorClass = "bg-teal-500";
//
//                                         return (
//                                             <li
//                                                 key={community.community_id}
//                                                 className="flex items-center justify-between"
//                                             >
//                                                 <div className="flex items-center">
//                                                     <div
//                                                         className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium mr-3 ${bgColorClass}`}
//                                                     >
//                                                         {community.community_name.charAt(0).toUpperCase()}
//                                                     </div>
//                                                     <div>
//                                                         <Link
//                                                             href={`/community/${
//                                                                 community.community_id
//                                                             }-${community.community_name.toLowerCase()}`}
//                                                             className="font-medium text-gray-900 dark:text-white text-sm hover:underline"
//                                                         >
//                                                             r/{community.community_name}
//                                                         </Link>
//                                                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                                                             {community.total_member || 0} members
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-xs font-medium text-green-600 dark:text-green-400">
//                                                     {community.growth || "↑ New"}
//                                                 </div>
//                                             </li>
//                                         );
//                                     })
//                                 ) : (
//                                     <div className="text-center text-gray-500 dark:text-gray-400 py-4">
//                                         <p>No popular communities found</p>
//                                     </div>
//                                 )}
//                             </ul>
//                             <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
//                                 <button
//                                     className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
//                                     onClick={() => router.push("/all-community-list")}
//                                 >
//                                     See All Communities
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Who to Follow widget */}
//                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
//                         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                             <h3 className="font-medium text-gray-900 dark:text-white">
//                                 Who to Follow
//                             </h3>
//                         </div>
//                         <div className="p-4">
//                             <ul className="space-y-4">
//                                 {whoToFolllow && whoToFolllow.length > 0 ? (
//                                     whoToFolllow.map((user) => (
//                                         <li
//                                             key={user.user_id}
//                                             className="flex items-start justify-between"
//                                         >
//                                             <div className="flex items-start">
//                                                 <Link
//                                                     href={`/profile/${user.user_name}`}
//                                                     className="h-10 w-10 rounded-full mr-3 flex items-center justify-center text-white text-sm font-medium overflow-hidden hover:opacity-90 transition"
//                                                     style={{
//                                                         backgroundColor:
//                                                             user.user_profile_image !== "default.jpg"
//                                                                 ? "transparent"
//                                                                 : getCommunityColor(user.user_name),
//                                                     }}
//                                                 >
//                                                     {user.user_profile_image !== "default.jpg" ? (
//                                                         <img
//                                                             src={user.user_profile_image}
//                                                             alt={user.user_name}
//                                                             className="h-full w-full object-cover"
//                                                             onError={(e) => {
//                                                                 const target = e.target as HTMLImageElement;
//                                                                 target.src = "/default.jpg";
//                                                             }}
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src="/default.jpg"
//                                                             alt={user.user_name}
//                                                             className="h-full w-full object-cover"
//                                                         />
//                                                     )}
//                                                 </Link>
//
//                                                 <div className="flex-1 min-w-0">
//                                                     <Link
//                                                         href={`/profile/${user.user_name}`}
//                                                         className="font-medium text-gray-900 dark:text-white text-sm truncate hover:text-blue-500 dark:hover:text-blue-400 transition"
//                                                     >
//                                                         u/{user.user_name}
//                                                     </Link>
//                                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
//                                                         {user.followers_count} followers
//                                                     </p>
//                                                 </div>
//                                             </div>
//
//                                             <button
//                                                 onClick={() => handleFollowUser(user.user_id)}
//                                                 className={`ml-2 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
//                                                     followStatus[String(user.user_id)] === "following"
//                                                         ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
//                                                         : "bg-blue-500 hover:bg-blue-600 text-white"
//                                                 }`}
//                                             >
//                                                 {followStatus[String(user.user_id)] === "following"
//                                                     ? "Following"
//                                                     : "Follow"}
//                                             </button>
//                                         </li>
//                                     ))
//                                 ) : (
//                                     <div className="text-center text-gray-500 dark:text-gray-400 py-4">
//                                         <p>No suggestions available</p>
//                                     </div>
//                                 )}
//                             </ul>
//                         </div>
//                     </div>
//                 </aside>
//             </div>
//
//             {/* Create Community Modal */}
//             {showCreateCommunityModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div
//                         className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                                     Create a Community
//                                 </h3>
//                                 <button
//                                     onClick={() => setShowCreateCommunityModal(false)}
//                                     className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-6 w-6"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M6 18L18 6M6 6l12 12"
//                                         />
//                                     </svg>
//                                 </button>
//                             </div>
//
//                             <form onSubmit={handleCreateCommunity}>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                         Name
//                                     </label>
//                                     <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
//                       r/
//                     </span>
//                                         <input
//                                             type="text"
//                                             value={newCommunityName}
//                                             onChange={(e) => setNewCommunityName(e.target.value)}
//                                             className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="community_name"
//                                             required
//                                         />
//                                     </div>
//                                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                                         Community names including capitalization cannot be changed.
//                                     </p>
//                                 </div>
//
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                         Description
//                                     </label>
//                                     <textarea
//                                         value={newCommunityDescription}
//                                         onChange={(e) => setNewCommunityDescription(e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                                         rows={3}
//                                         placeholder="What is your community about?"
//                                     ></textarea>
//                                 </div>
//
//                                 <div className="mb-6">
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                         Community Type
//                                     </label>
//                                     <div className="space-y-2">
//                                         <div className="flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 id="public"
//                                                 name="communityType"
//                                                 value="public"
//                                                 checked={communityType === "public"}
//                                                 onChange={() => setCommunityType("public")}
//                                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                             />
//                                             <label
//                                                 htmlFor="public"
//                                                 className="ml-3 block text-sm text-gray-700 dark:text-gray-300"
//                                             >
//                                                 <span className="font-medium">Public</span>
//                                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                     Anyone can view, post, and comment
//                                                 </p>
//                                             </label>
//                                         </div>
//
//                                         <div className="flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 id="restricted"
//                                                 name="communityType"
//                                                 value="restricted"
//                                                 checked={communityType === "restricted"}
//                                                 onChange={() => setCommunityType("restricted")}
//                                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                             />
//                                             <label
//                                                 htmlFor="restricted"
//                                                 className="ml-3 block text-sm text-gray-700 dark:text-gray-300"
//                                             >
//                                                 <span className="font-medium">Restricted</span>
//                                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                     Anyone can view, but only approved users can post
//                                                 </p>
//                                             </label>
//                                         </div>
//
//                                         <div className="flex items-center">
//                                             <input
//                                                 type="radio"
//                                                 id="private"
//                                                 name="communityType"
//                                                 value="private"
//                                                 checked={communityType === "private"}
//                                                 onChange={() => setCommunityType("private")}
//                                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                                             />
//                                             <label
//                                                 htmlFor="private"
//                                                 className="ml-3 block text-sm text-gray-700 dark:text-gray-300"
//                                             >
//                                                 <span className="font-medium">Private</span>
//                                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                     Only approved users can view and post
//                                                 </p>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex justify-end space-x-3">
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowCreateCommunityModal(false)}
//                                         className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:opacity-50"
//                                         disabled={!newCommunityName.trim()}
//                                     >
//                                         Create Community
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             <AuthModal
//                 isOpen={isAuthModalOpen}
//                 onClose={() => setIsAuthModalOpen(false)}
//             />
//         </div>
//     );
// }
