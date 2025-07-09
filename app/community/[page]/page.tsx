"use client";

import {
  fetchCommunity,
  fetchCommunityList,
  setCommunityDelete,
  setCommunityEdit,
  setCommunityJoinOrLeave,
} from "@/store/slices/communityGroupsSlice";
import {
  fetchCommunityPostList,
  setCommunityPostLike,
  setNewCommunityComment,
  setNewCommunityPost,
} from "@/store/slices/communityPostSlice";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { MouseEvent, SetStateAction, useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import toast from "react-hot-toast";
import {BackendPost, PollOption, TransformedPost} from "@/lib/postInterface/post";
import {formatTimeAgo} from "@/lib/helper";
import AuthModal from "@/components/modals/AuthModal";
const useAppDispatch = () => useDispatch<AppDispatch>();
interface CommunityState {
  id: number;
  name: string;
  slug: any;
  description: string;
  memberCount: number;
  postCount: string;
  createdAt: string;
  userHasJoined: boolean;
  color: any;
  bannerImage?: any;
  admin?: {
    username: any;
    avatar: any;
  };
  members?: any;
}

const transformBackendPost = (backendPost: BackendPost): TransformedPost => {
  const transformedPost: TransformedPost = {
    id: backendPost.post_id,
    title: backendPost.post_poll?.poll_title ||
        backendPost.post_title ||
        "Untitled Post",
    content: backendPost.post_content,
    type: backendPost.post_type === "poll"
        ? "poll"
        : backendPost.post_type === "image"
            ? "image"
            : "text",
    createdAt: backendPost.created_date,
    likeCount: parseInt(backendPost.like_count) || 0,
    commentCount: backendPost.comments?.length || 0,
    author: {
      username: backendPost.user_name,
      avatar: backendPost.user_profile_image !== "default.jpg"
          ? backendPost.user_profile_image
          : null,
    },
    communitySlug: "general",
    communityName: "General",
    comments: backendPost.comments || [],
    userVote: undefined
  };

  if (backendPost.post_type === "poll" && backendPost.post_poll) {
    transformedPost.pollOptions =
      backendPost.post_poll.answers?.map((answer: string, index: number) => {
        const answerCount =
          backendPost.post_poll_answers?.find(
            (a: any) => parseInt(String(a.answer_no)) === index
          )?.count || 0;

        return {
          id: `p${index + 1}`,
          text: answer,
          votes: parseInt(String(answerCount)) || 0,
        };
      }) || [];

    transformedPost.totalVotes = transformedPost.pollOptions.reduce(
      (sum: number, option: PollOption) => sum + option.votes,
      0
    );
    transformedPost.votedOption = backendPost.post_poll_voted
      ? `p${backendPost.post_poll_voted}`
      : null;
    transformedPost.pollEndsAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ).toISOString();
  }

  if (
    backendPost.post_type === "image" &&
    backendPost.post_image &&
    backendPost.post_image !== "default.jpg"
  ) {
    transformedPost.imageUrl = backendPost.post_image;
  }

  return transformedPost;
};
const CommunityGroup = () => {
  const { page } = useParams();
  const [isClient, setIsClient] = useState(false);

  const splitArray = (page as string)?.split("-") || [];
  const communityId = splitArray[0];
  const community_slug_name = splitArray[1];
  const [postCount, setPostCount] = useState("0");
  const [activeDropdown, setActiveDropdown] = useState<
    string | number | null | any
  >(null);
  const [userToBan, setUserToBan] = useState<any>(null);
  const [posts, setPosts] = useState<TransformedPost[]>([]);
  const [communityDetail, setCommunityDetail] = useState<any>([]);
  const [mousePosition, setMousePosition] = useState({
    x: 0.5,
    y: 0.5,
  });
  const dispatch = useAppDispatch();
  const [communityAdmin, setCommunityAdmin] = useState<any>(null);
  // Fetch community list on component mount
  useEffect(() => {
    const fetchCommunitiesData = async () => {
      try {
        await dispatch(fetchCommunityList({ project: {} }));
      } catch (error) {}
    };

    fetchCommunitiesData();
  }, [dispatch]);

  const { communityPostListData, communityPostListTotalCount } = useSelector(
    (state: any) => state.communityPost
  );
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const handleCreatePost = async (e: any) => {
    e.preventDefault();

    if (!postTitle.trim()) {
      toast.error("Please enter post title");
      return;
    }

    if (!communityId) {
      toast.error("Community information not found");
      return;
    }
    if (!community?.userHasJoined) {
      setIsCreatingPost(false);
      toast.error("You cannot share because you are not a member of this community");
      return;
    }

    setIsSubmittingPost(true);
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      setIsSubmittingPost(false);
      return;
    }

    try {
      let pollData = null;
      if (postType === "poll") {
        const validPollOptions = pollOptions.filter(
            (option) => option.trim() !== ""
        );
        if (validPollOptions.length < 2) {
          toast.error("Poll requires at least 2 options");
          setIsSubmittingPost(false);
          return;
        }
        pollData = JSON.stringify({
          poll_title: postTitle,
          answers: validPollOptions,
        });
      }

      // Tip hatasını önlemek için any kullan ya da interface tanımla
      const postParams: any = {
        post_type: postType,
        post_method: "community",
        post_method_community_id: communityId,
        post_title: postTitle,
        post_content:
            postType === "poll"
                ? postTitle
                : postContent
                    ? "\n\n" + postContent
                    : "",
        project: {},
      };

      if (pollData) {
        postParams.post_poll = pollData;
      }

      if (postType === "image" && selectedImageFile) {
        postParams.post_image = selectedImageFile;
      }

      const result = await dispatch(setNewCommunityPost(postParams));

      if (result.payload && result.payload.status === true) {
        setPostTitle("");
        setPostContent("");
        setPollOptions(["", ""]);
        setImagePreview(null);
        setSelectedImageFile(null);
        setPostType("text");
        setIsCreatingPost(false);
        toast.success("Your Post shared successfully!");
        await fetchPosts();
      } else {
        // Özel hata mesajları için kontrol
        if (result.payload?.message === "You should wait 5 minutes before making a new post!") {
          toast.error("You should wait 5 minutes before making a new post!");
        } else {
          toast.error(result.payload?.message || "Failed to create post");
        }
      }
    } catch (error) {
      console.log("Post oluşturma hatası:", error);
      toast.error("An error occurred while creating the post");
    } finally {
      setIsSubmittingPost(false);
    }
  };
  const getPosts = () => {
    if (
      !communityPostListData ||
      !communityPostListData.data ||
      !Array.isArray(communityPostListData.data)
    ) {
      return [];
    }
    return communityPostListData.data.map(transformBackendPost);
  };

  const postsList = getPosts();
  useEffect(() => {
    setCommunity((prev) => ({
      ...prev,
      postCount: postCount,
    }));
  }, [postCount]);
  const fetchPosts = async () => {
    if (!communityId) return;

    try {
      const result = await dispatch(
        fetchCommunityPostList({
          community_id: communityId,
          user_id: 0,
          hashtag_name: "",
          post_id: 0,
          limit: 10,
          offset: 0,
          project: {},
        }) as any
      );
      setPostCount(result?.payload?.totalCount);
    } catch (error) {}
  };
  useEffect(() => {
    if (communityId) {
      fetchPosts();
      getCommunityDetail();
    }
  }, [communityId]);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // 'basic', 'rules', 'moderators', 'appearance'
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postType, setPostType] = useState("text");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("24h");

  // // Community rules state
  // const [rules, setRules] = useState([
  //   {
  //     id: 1,
  //     title: "Be respectful",
  //     description:
  //       "Treat everyone with respect. No personal attacks or harassment.",
  //   },
  //   {
  //     id: 2,
  //     title: "No spam",
  //     description:
  //       "Don't spam or flood the community with excessive posts or comments.",
  //   },
  // ]);

  // New rule state
  const [newRule, setNewRule] = useState({ title: "", description: "" });
  const handleLike = async (postId: any, direction: any) => {
    try {
      const result = await dispatch(
          setCommunityPostLike({
            post_id: postId,
            project: {},
          })
      );

      if (result.payload && result.payload.status === true) {
        toast.success(`Post ${direction === "up" ? "liked" : "disliked"} successfully!`);
        await fetchPosts();
      } else {
        toast.error(result.payload?.message || "Failed to update like status");
      }
    } catch (error) {
      console.error("❌ Like işlemi sırasında hata:", error);
      toast.error("An error occurred while updating like status");
    }
  };
  // Moderators state
  const [moderators, setModerators] = useState([
    {
      id: 1,
      username: "AdminUser",
      role: "Owner",
      joinedDate: "June 2021",
      avatar: null,
      permissions: {
        deletePost: true,
        deleteCommunity: true,
        banUsers: true,
        editRules: true,
        addModerators: true,
        removeModerators: true,
      },
    },
    {
      id: 2,
      username: "ModeratorOne",
      role: "Moderator",
      joinedDate: "August 2021",
      avatar: null,
      permissions: {
        deletePost: true,
        deleteCommunity: false,
        banUsers: true,
        editRules: true,
        addModerators: false,
        removeModerators: false,
      },
    },
  ]);
  useEffect(() => {
    if (!isClient) return;

    // Düzeltme: Event tipini değiştirin
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as unknown as MouseEvent; // Native MouseEvent olarak cast edin
      setMousePosition({
        x: mouseEvent.clientX / window.innerWidth,
        y: mouseEvent.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isClient]);  const [newModerator, setNewModerator] = useState("");

  // Moderator roles with predefined permissions
  const moderatorRoles: any = {
    Owner: {
      label: "Owner",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      permissions: {
        deletePost: true,
        deleteCommunity: true,
        banUsers: true,
        editRules: true,
        addModerators: true,
        removeModerators: true,
      },
    },
    Admin: {
      label: "Admin",
      color:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      permissions: {
        deletePost: true,
        deleteCommunity: false,
        banUsers: true,
        editRules: true,
        addModerators: true,
        removeModerators: true,
      },
    },
    Moderator: {
      label: "Moderator",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      permissions: {
        deletePost: true,
        deleteCommunity: false,
        banUsers: true,
        editRules: true,
        addModerators: false,
        removeModerators: false,
      },
    },
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const getCommunityDetail = async () => {
    if (!communityId) return;
    try {
      const result = await dispatch(
        fetchCommunity({
          community_id: communityId,
          project: {},
        })
      );
      if (result.payload && result.payload.data) {
        const backendData = result.payload.data;
        console.log(backendData, "deaty backend");
        setCommunityDetail(backendData);
        setCommunityAdmin(backendData.community_admin);
        setCommunity((prev) => ({
          ...prev,
          id: backendData.community_id,
          name: backendData.community_name,
          description: backendData.community_description,
          memberCount: backendData.total_member,
          userHasJoined: backendData.joined_status,
          color: backendData.community_style || "bg-blue-500",
          createdAt: backendData.created_date,
          admin: {
            username: backendData.community_admin?.user_name,
            avatar: backendData.community_admin?.user_profile_image,
          },
          members: {
            backendData,
          },
        }));
      }
    } catch (error) {
      console.error("Community detail fetch error:", error);
    }
  };
  useEffect(() => {
    setIsClient(true);

    // Dark mode kontrolü sadece client-side'da
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setDarkMode(mediaQuery.matches);

      const handleChange = (e: any) => {
        setDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);
  const [community, setCommunity] = useState<CommunityState>({
    id: 1,
    name: page === "runners" ? "Runners" : "Healthy Eating",
    slug: page,
    description:
      page === "runners"
        ? "A community for everyone who loves running and wants to share different experiences."
        : "A community sharing tips and recipes about healthy eating.",
    memberCount: 0,
    postCount: postCount,
    createdAt: "2021-06-15T10:00:00Z",
    userHasJoined: false,
    color: page === "runners" ? "bg-blue-500" : "bg-blue-500", // Her iki topluluk için de mavi renk kullanıyoruz
    bannerImage:
      page === "runners"
        ? "https://images.unsplash.com/photo-1502904550040-7534597429ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        : "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  });
  console.log(community,"")
  const handleJoinToggle = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const result = await dispatch(
          setCommunityJoinOrLeave({
            community_id: communityId,
            project: {},
          })
      );

      if (result.payload && result.payload.status === true) {
        setCommunity((prev) => ({
          ...prev,
          userHasJoined: !prev.userHasJoined,
        }));

        toast.success(
            !community?.userHasJoined
                ? "Successfully joined the community!"
                : "Successfully left the community!"
        );
      } else {
        toast.error(result.payload?.message || "Failed to update membership status");
      }
    } catch (error) {
      console.error("Error joining/leaving community:", error);
      toast.error("An error occurred while updating membership");
    }
  };

  // Dark mode - sistem tercihine göre otomatik ayarlanacak
  const [darkMode, setDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sistem tercihi değiştiğinde dark mode'u güncelle
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: any) => {
      setDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  // İlk yüklemede dark mode'u ayarla
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // For comments functionality
  const [activeComments, setActiveComments] = useState<
    Record<string | number, boolean>
  >({});
  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleComments = (postId: string | number) => {
    setActiveComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
      postId: any
  ) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const result = await dispatch(
          setNewCommunityComment({
            parent_post_id: postId,
            post_content: commentText.trim(),
            project: {},
          }) as any
      );

      if (result.payload && result.payload.status === true) {
        setCommentText("");
        toast.success("Comment added successfully!");
        await fetchPosts();
      } else {
        toast.error(result.payload?.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      toast.error("An error occurred while adding comment");
    }
  };
  const [communitySettings, setCommunitySettings] = useState({
    name: "",
    description: "",
    style: "bg-blue-500",
  });

  // Community bilgileri geldiğinde form'u doldur
  useEffect(() => {
    if (community) {
      setCommunitySettings({
        name: community.name || "",
        description: community.description || "",
        style: community.color || "bg-blue-500",
      });
    }
  }, [community]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const removePollOption = (index: number) => {
    const updatedOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updatedOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  // Add these new functions for rule management and moderator management
  // const handleAddRule = () => {
  //   if (newRule.title.trim() && newRule.description.trim()) {
  //     setRules([
  //       ...rules,
  //       {
  //         id: rules.length > 0 ? Math.max(...rules.map((r) => r.id)) + 1 : 1,
  //         title: newRule.title,
  //         description: newRule.description,
  //       },
  //     ]);
  //     setNewRule({ title: "", description: "" });
  //   }
  // };

  // const handleDeleteRule = (id: any) => {
  //   setRules(rules.filter((rule) => rule.id !== id));
  // };

  const handleAddModerator = () => {
    if (newModerator.trim()) {
      setModerators([
        ...moderators,
        {
          id:
            moderators.length > 0
              ? Math.max(...moderators.map((m) => m.id)) + 1
              : 1,
          username: newModerator,
          role: "Moderator",
          joinedDate: new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          avatar: null,
          permissions: moderatorRoles.Moderator.permissions,
        },
      ]);
      setNewModerator("");
    }
  };

  const handleRemoveModerator = (id: number) => {
    setModerators(moderators.filter((mod) => mod.id !== id));
  };

  // Function to update moderator role
  const handleUpdateModeratorRole = (id: number, newRole: string) => {
    setModerators(
      moderators.map((mod) =>
        mod.id === id
          ? {
              ...mod,
              role: newRole,
              permissions: moderatorRoles[newRole].permissions,
            }
          : mod
      )
    );
  };
  const handleUpdateCommunity = async () => {
    try {
      const result = await dispatch(
          setCommunityEdit({
            community_name: communitySettings.name,
            community_description: communitySettings.description,
            community_style: communitySettings.style,
            project: {},
          })
      );

      if (result.payload && result.payload.status === true) {
        toast.success("Community updated successfully!");
        await getCommunityDetail();
        setShowSettings(false);
      } else {
        toast.error(result.payload?.message || "Failed to update community");
      }
    } catch (error) {
      console.log("Community update error:", error);
      toast.error("An error occurred while updating community");
    }
  };
  const handleDeleteCommunity = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this community? This action cannot be undone and will permanently remove all posts, members, and data associated with this community."
      )
    ) {
      return;
    }

    // İkinci onay için kullanıcıdan community adını girmesini iste
    const confirmText = window.prompt(
      `Please type "${community.name}" to confirm deletion:`
    );

    if (confirmText !== community.name) {
      alert("Community name does not match. Deletion cancelled.");
      return;
    }

    try {
      const result = await dispatch(
        setCommunityDelete({
          project: {},
        })
      );

      if (result.payload && result.payload.status === "success") {
        toast.error("Community deleted successfully!");
        window.location.href = "/";
      } else {
        throw new Error(result.payload?.message || "Delete failed");
      }
    } catch (error) {
      console.log("Community delete error:", error);
      toast.error("Failed to delete community. Please try again.");
    }
  };
  // Function to update specific permission
  const handleUpdatePermission = (
    id: number,
    permission: string,
    value: boolean
  ) => {
    setModerators(
      moderators.map((mod) =>
        mod.id === id
          ? { ...mod, permissions: { ...mod.permissions, [permission]: value } }
          : mod
      )
    );
  };

  // Function to handle ban user
  const handleBanUser = () => {
    // Here you would implement the actual ban logic
    // This would typically involve an API call
    console.log(
      `Banning user: ${userToBan?.username} for ${banDuration} because: ${banReason}`
    );

    // Close the modal and reset values
    setShowBanModal(false);
    setBanReason("");
    setBanDuration("24h");
    setUserToBan(null);

    // Show a success toast notification or some feedback
    alert(`User ${userToBan?.username} has been banned for ${banDuration}`);
  };

  // Function to open ban modal
  const openBanModal = (user: any) => {
    setUserToBan(user);
    setShowBanModal(true);
  };

  // Function to handle post deletion
  const handleDeletePost = (postId: any) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      // Remove the post from the state
      // @ts-ignore
      setPosts(posts.filter((post) => post?.id !== postId));

      // In a real application, you would also call an API to delete the post
      console.log(`Deleting post with ID ${postId}`);

      // Show a success message
      alert("Post deleted successfully");
    }
  };

  // Add new state for dropdown menu

  // Toggle dropdown menu
  const toggleDropdown = (postId: SetStateAction<null>) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // State definition bölümüne eklenecek yeni state değişkenleri
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      username: "john_doe",
      requestDate: "2023-10-24T14:30:00Z",
      message:
        "I'd love to join this community because I'm passionate about running.",
    },
    {
      id: 2,
      username: "sarah_runner",
      requestDate: "2023-10-23T09:15:00Z",
      message:
        "Hi, I'm a marathon enthusiast and would like to be part of your community?.",
    },
    {
      id: 3,
      username: "track_master",
      requestDate: "2023-10-22T18:45:00Z",
      message:
        "Long-time runner looking for a good community to share experiences.",
    },
  ]);
  const [inviteLink, setInviteLink] = useState(
    "https://community?.example.com/join/running-club?code=abc123xyz"
  );
  const [autoApprove, setAutoApprove] = useState(false);
  const [pendingPosts, setPendingPosts] = useState([
  ]);
  const loginUser = useSelector(
    (state: RootState) => state.usersAuth.loginUser
  );

  const isAuthenticated = loginUser?.user_id !== null && loginUser?.user_id !== undefined;
  const currentUserName = loginUser?.user_name;
  const isCurrentUserAdmin =
    currentUserName && communityAdmin?.user_name === currentUserName;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Community Banner with modern dynamic background - similar to UserProfile */}
      <div className="relative overflow-hidden bg-[#040718] text-white h-36 sm:h-48">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dynamic particles */}
          <div
            className="absolute w-full h-full opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at ${
                mousePosition.x * 100
              }% ${
                mousePosition.y * 100
              }%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
              transition: "background-image 0.3s ease-out",
            }}
          ></div>

          {/* Moving gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-purple-900/40 z-0"></div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              animation: "backgroundMove 30s linear infinite",
            }}
          ></div>

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -left-20 top-1/2 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
            {/* Header ve butonları içeren flex konteyner */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-3 sm:space-y-0">
              {/* Topluluk avatarı ve adı */}
              <div className="flex items-end space-x-3">
                <div className="relative">
                  <div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[90%] h-6 bg-black/30 blur-xl rounded-full hidden sm:block"
                    style={{
                      animation: "shadowPulse 3s infinite ease-in-out",
                    }}
                  ></div>
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20 ${community?.color} flex items-center justify-center shadow-xl relative overflow-hidden`}
                  >
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {community?.name.charAt(0)}
                    </span>
                    {/* Reflection/shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none"></div>
                  </div>
                </div>
                <div className="mb-0 sm:mb-2">
                  <h1 className="text-xl sm:text-3xl font-bold text-white">
                    r/{decodeURIComponent(community?.slug || "")}
                  </h1>
                  <p className="text-sm sm:text-base text-white text-opacity-90">
                    {community?.memberCount.toLocaleString()} members •{" "}
                  </p>
                </div>
              </div>

              {/* Butonlar bölümü */}
              <div className="flex self-end space-x-2 sm:space-x-3">
                <button
                  onClick={handleJoinToggle}
                  className={`py-1.5 sm:py-2.5 px-4 sm:px-6 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md ${
                    community?.userHasJoined
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {community?.userHasJoined ? "Joined" : "Join"}
                </button>

                {isCurrentUserAdmin && (
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1.5 sm:p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                    aria-label="Community Settings"
                    title="Community Settings"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Feed */}
          <div className="flex-1">
            {/* Create Post card - UPDATED */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
              {!isCreatingPost ? (
                // Collapsed view (Reddit-like)
                <div className="p-2" onClick={() => setIsCreatingPost(true)}>
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white font-bold">
                        {localStorage
                          .getItem("username")
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </div>
                    </div>
                    <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full h-10 px-4 flex items-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Create Post
                    </div>
                  </div>

                  <div className="flex border-t border-gray-200 dark:border-gray-700 mt-1">
                    <button
                      className="flex-1 flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreatingPost(true);
                        setPostType("image");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Image</span>
                    </button>
                    <button
                      className="flex-1 flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAuthenticated) {
                          setIsCreatingPost(true);
                          setPostType('poll');
                        } else {
                          setIsAuthModalOpen(true);
                        }
                      }}
                      disabled={!isAuthenticated}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 7H7v6h6V7z" />
                        <path
                          fillRule="evenodd"
                          d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Poll</span>
                    </button>
                    <button
                      className="flex-1 flex justify-center items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAuthenticated) {
                          setIsCreatingPost(true);
                          setPostType('text');
                        } else {
                          setIsAuthModalOpen(true);
                        }
                      }}
                      disabled={!isAuthenticated}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
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
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Expanded view (Reddit-like)
                <div className="p-4 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Create a post
                    </h2>
                    <button
                      onClick={() => {
                        setIsCreatingPost(false);
                        setPostTitle("");
                        setPostContent("");
                        setImagePreview(null);
                        setPollOptions(["", ""]);
                        setPostType("text");
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Community selector - already in community, so show the current one */}
                  <div className="mb-4">
                    <select
                      value={community?.slug}
                      disabled
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={community?.slug}>
                        r/{community?.name || community?.slug}
                      </option>
                    </select>
                  </div>

                  {/* Post type tabs - Reddit style */}
                  <div className="flex border border-gray-200 dark:border-gray-700 rounded-md mb-4 overflow-hidden">
                    <button
                      onClick={() => setPostType("text")}
                      className={`flex-1 py-2 px-4 font-medium text-sm ${
                        postType === "text"
                          ? "bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
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
                        Post
                      </div>
                    </button>
                    <button
                      onClick={() => setPostType("image")}
                      className={`flex-1 py-2 px-4 font-medium text-sm ${
                        postType === "image"
                          ? "bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Image
                      </div>
                    </button>
                    <button
                      onClick={() => setPostType("poll")}
                      className={`flex-1 py-2 px-4 font-medium text-sm ${
                        postType === "poll"
                          ? "bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Poll
                      </div>
                    </button>
                  </div>

                  {/* Title - Always visible */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Content based on selected type */}
                  <div className="mb-4">
                    {/* Text post content */}
                    {postType === "text" && (
                      <div className="animate-fadeIn">
                        <textarea
                          placeholder="Text (optional)"
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          rows={8}
                        ></textarea>
                      </div>
                    )}

                    {/* Image post content */}
                    {postType === "image" && (
                      <div className="animate-fadeIn">
                        {imagePreview ? (
                          <div className="relative mb-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-96 mx-auto"
                            />
                            <button
                              onClick={() => setImagePreview(null)}
                              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Drag and drop an image, or
                            </p>
                            <label className="mt-3 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer text-sm">
                              <span>Upload</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                        )}

                        <textarea
                          placeholder="Caption (optional)"
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                          rows={3}
                        ></textarea>
                      </div>
                    )}

                    {/* Poll post content */}
                    {postType === "poll" && (
                      <div className="animate-fadeIn">
                        <div className="mb-4 space-y-3">
                          {pollOptions.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) =>
                                  updatePollOption(index, e.target.value)
                                }
                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {index > 1 && (
                                <button
                                  onClick={() => removePollOption(index)}
                                  className="ml-2 text-gray-500 hover:text-red-500"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={addPollOption}
                          className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm mb-4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add Option
                        </button>

                        <div className="flex items-center mb-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Poll Length
                            </label>
                            <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="1">1 Day</option>
                              <option value="3">3 Days</option>
                              <option value="7">7 Days</option>
                              <option value="30">30 Days</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsCreatingPost(false);
                        setPostTitle("");
                        setPostContent("");
                        setImagePreview(null);
                        setPollOptions(["", ""]);
                        setPostType("text");
                      }}
                      className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      disabled={!postTitle.trim() || isSubmittingPost}
                    >
                      {isSubmittingPost ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {postsList.length > 0 ? (
                postsList.map((post: any) => (
                  <div
                    key={post?.id}
                    className={`rounded-lg shadow ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-white text-gray-800"
                    } overflow-hidden`}
                  >
                    {/* Vote sidebar */}
                    <div className="flex">
                      <div
                        className={`w-10 md:w-12 flex flex-col items-center pt-2 ${
                          darkMode ? "bg-gray-900" : "bg-gray-50"
                        }`}
                      >
                        <button
                          onClick={() => handleLike(post?.id, "up")}
                          className={`p-1 rounded ${
                            post?.userVote === "up"
                              ? "text-orange-500"
                              : "text-gray-400 hover:text-gray-500"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <span className="my-1 font-medium text-sm">
                          {post?.likeCount}
                        </span>
                        <button
                          onClick={() => handleLike(post?.id, "down")}
                          className={`p-1 rounded ${
                            post?.userVote === "down"
                              ? "text-blue-500"
                              : "text-gray-400 hover:text-gray-500"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex-1 p-3">
                        {/* Post Header */}
                        <div className="flex items-center mb-3">
                          <div
                            className={`h-10 w-10 rounded-full overflow-hidden mr-3 flex items-center justify-center text-white font-medium text-lg ${
                              post?.communityStyle || "bg-blue-500"
                            }`}
                          >
                            {post?.communityName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow">
                            <Link
                              href={`/community/${post?.communitySlug}`}
                              className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
                            >
                              r/{decodeURIComponent(community?.slug || "")}
                            </Link>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span>Posted by u/{post?.author.username}</span>
                              {post?.author.rank && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                    {post?.author.rank.rank_name}
                                  </span>
                                </>
                              )}
                              <span className="mx-1">•</span>
                              <span>{post?.createdAt}</span>
                              {post?.contentEdited && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span className="text-gray-400 italic">
                                    edited
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {isCurrentUserAdmin && (
                            <div
                              className="relative"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(post?.id);
                                }}
                                aria-label="Post options"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-gray-500 dark:text-gray-400"
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

                              {activeDropdown === post?.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5 text-sm">
                                  {/* Admin can delete posts */}
                                  <button
                                    onClick={() => {
                                      handleDeletePost(post?.id);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2"
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
                                    Delete Post
                                  </button>

                                  {/* Admin can ban users */}
                                  <button
                                    onClick={() => {
                                      openBanModal(post?.author);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                      />
                                    </svg>
                                    Ban User
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Post Content */}
                        <Link
                          href={`/community/${community_slug_name}/post/${post?.id}`}
                          className="block"
                        >
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {post?.title}
                          </h2>
                        </Link>
                        <div
                          className={`mb-4 text-gray-800 dark:text-gray-200`}
                        >
                          <p>{post?.content}</p>
                        </div>

                        {/* Image gösterimi */}
                        {post?.imageUrl && (
                          <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={post?.imageUrl}
                              alt={post?.title}
                              className="w-full object-cover max-h-[600px]"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Poll gösterimi (eğer poll tipindeyse) */}
                        {post?.type === "poll" && post?.pollOptions && (
                          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="space-y-2">
                              {post?.pollOptions.map((option: any) => (
                                <div
                                  key={option.id}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border hover:bg-gray-50 dark:hover:bg-gray-500 cursor-pointer"
                                >
                                  <span className="text-sm">{option.text}</span>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {option.votes} votes
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Total votes: {post?.totalVotes || 0}
                            </div>
                          </div>
                        )}

                        {/* post actions */}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                          <button
                            onClick={() => toggleComments(post?.id)}
                            className={`flex items-center mr-4 ${
                              activeComments[post?.id]
                                ? "text-blue-500 dark:text-blue-400"
                                : ""
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                            <span>{post?.commentCount} Comments</span>
                          </button>

                          {/*<button className="flex items-center mr-4">*/}
                          {/*  <svg*/}
                          {/*    xmlns="http://www.w3.org/2000/svg"*/}
                          {/*    className="h-5 w-5 mr-1"*/}
                          {/*    fill="none"*/}
                          {/*    viewBox="0 0 24 24"*/}
                          {/*    stroke="currentColor"*/}
                          {/*  >*/}
                          {/*    <path*/}
                          {/*      strokeLinecap="round"*/}
                          {/*      strokeLinejoin="round"*/}
                          {/*      strokeWidth={2}*/}
                          {/*      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"*/}
                          {/*    />*/}
                          {/*  </svg>*/}
                          {/*  <span>Share</span>*/}
                          {/*</button>*/}

                          {/*<button className="flex items-center">*/}
                          {/*  <svg*/}
                          {/*    xmlns="http://www.w3.org/2000/svg"*/}
                          {/*    className="h-5 w-5 mr-1"*/}
                          {/*    fill="none"*/}
                          {/*    viewBox="0 0 24 24"*/}
                          {/*    stroke="currentColor"*/}
                          {/*  >*/}
                          {/*    <path*/}
                          {/*      strokeLinecap="round"*/}
                          {/*      strokeLinejoin="round"*/}
                          {/*      strokeWidth={2}*/}
                          {/*      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"*/}
                          {/*    />*/}
                          {/*  </svg>*/}
                          {/*  <span>Save</span>*/}
                          {/*</button>*/}
                        </div>

                        {/* Comments Section */}
                        {activeComments[post?.id] && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {/* Comment Form */}
                            <div className="p-4 bg-white dark:bg-gray-800">
                              <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                                rows={3}
                              ></textarea>
                              <div className="mt-2 flex justify-end">
                                <button
                                  onClick={(e) =>
                                    handleCommentSubmit(e, post?.id)
                                  }
                                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full text-sm font-medium"
                                >
                                  Comment
                                </button>
                              </div>
                            </div>

                            {/* Comments List */}
                            <div className="bg-white dark:bg-gray-800">
                              {post.comments.length > 0 ? (
                                post.comments.map((comment: any) => (
                                  <div
                                    key={comment.id}
                                    className="flex items-start space-x-3 p-4 border-t border-gray-200"
                                  >
                                    {/* Avatar */}
                                    <img
                                      src={
                                        comment.user_profile_image
                                      }
                                      alt={comment.user_name}
                                      className="h-8 w-8 rounded-full object-cover"
                                    />

                                    {/* Yorum içeriği */}
                                    <div className="flex-1">
                                      <div className="flex items-center text-sm text-gray-700 mb-1">
                                        <span className="font-medium">
                                          u/{comment.user_name}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>{comment.created_date}</span>
                                      </div>
                                      <p className="text-gray-800">
                                        {comment.post_content}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center text-gray-500 py-4">
                                  No comments yet
                                </p>
                              )}

                              {(post?.comments || []).length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                  <p className="text-sm">No comments yet</p>
                                  <p className="text-xs mt-1">
                                    Be the first to share what you think!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Hiç post yoksa gösterilecek empty state
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Be the first to share something in this community!
                  </p>
                  <button
                    onClick={() => setIsCreatingPost(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
                  >
                    Create First Post
                  </button>
                </div>
              )}
            </div>
          </div>
          {
            community.slug !== "general" &&
              (
                  <div className="hidden md:block w-80 space-y-4">
                    {/* Community info card - removed colored header */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <div
                              className="h-10 w-10 rounded-full mr-3 flex items-center justify-center text-white text-base font-bold"
                              style={{ backgroundColor: community?.color }}
                          >
                            {decodeURIComponent(community?.slug || "")
                                .charAt(0)
                                .toUpperCase()}
                          </div>
                          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                            r/{decodeURIComponent(community?.slug || "")}{" "}
                          </h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {community?.description}
                        </p>

                        {/* FIXED STATS BACKGROUND FOR DARK MODE */}
                        <div className="grid grid-cols-3 gap-2 text-center mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {community?.memberCount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                              <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                              >
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                              Members
                            </div>
                          </div>
                          {/*<div>*/}
                          {/*    <div className="font-medium text-gray-900 dark:text-white">*/}
                          {/*        {community?.onlineCount.toLocaleString()}*/}
                          {/*    </div>*/}
                          {/*    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">*/}
                          {/*        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>*/}
                          {/*        Online*/}
                          {/*    </div>*/}
                          {/*</div>*/}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {community?.postCount?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                              <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                              >
                                <path
                                    fillRule="evenodd"
                                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                                    clipRule="evenodd"
                                />
                                <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                              </svg>
                              Posts
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          <button
                              onClick={handleJoinToggle}
                              className={`py-2.5 px-4 sm:px-6 rounded-md font-medium transition-all duration-200 text-sm shadow-sm hover:shadow-md w-full ${
                                  community?.userHasJoined
                                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                      : "bg-blue-500 hover:bg-blue-600 text-white"
                              }`}
                          >
                            {community?.userHasJoined ? "Joined" : "Join Community"}
                          </button>
                          {isCurrentUserAdmin && (
                              <button
                                  onClick={() => setShowSettings(!showSettings)}
                                  className="p-1.5 sm:p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                                  aria-label="Community Settings"
                                  title="Community Settings"
                              >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                  />
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Community rules */}
                    {/*<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4">*/}
                    {/*  /!*<div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">*!/*/}
                    {/*  /!*  <h3 className="font-medium text-gray-900 dark:text-white">*!/*/}
                    {/*  /!*    Community Rules*!/*/}
                    {/*  /!*  </h3>*!/*/}
                    {/*  /!*  <button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">*!/*/}
                    {/*  /!*    View All*!/*/}
                    {/*  /!*  </button>*!/*/}
                    {/*  /!*</div>*!/*/}
                    {/*  /!*<div className="divide-y divide-gray-200 dark:divide-gray-700">*!/*/}
                    {/*    /!*{rules.map((rule) => (*!/*/}
                    {/*    /!*  <div key={rule.id} className="p-4">*!/*/}
                    {/*    /!*    <div>*!/*/}
                    {/*    /!*      <h4 className="font-medium text-gray-900 dark:text-white">*!/*/}
                    {/*    /!*        {rule.id}. {rule.title}*!/*/}
                    {/*    /!*      </h4>*!/*/}
                    {/*    /!*      <p className="text-sm text-gray-500 dark:text-gray-400">*!/*/}
                    {/*    /!*        {rule.description}*!/*/}
                    {/*    /!*      </p>*!/*/}
                    {/*    /!*    </div>*!/*/}
                    {/*    /!*  </div>*!/*/}
                    {/*    /!*))}*!/*/}

                    {/*    /!* Admin-only rule editing controls are moved to the settings modal *!/*/}
                    {/*  /!*</div>*!/*/}
                    {/*</div>*/}

                    {/* Community info with stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          About Community
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-medium">Created:</span>{" "}
                          {(() => {
                            const dateStr =
                                communityDetail?.created_date || community?.createdAt;
                            if (!dateStr) return "Unknown date";

                            try {
                              return new Date(dateStr).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                            } catch (error) {
                              return "Unknown date";
                            }
                          })()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {communityDetail?.community_description ||
                              community?.description ||
                              "No description available."}
                        </p>
                        <div className="flex items-center text-sm mb-2">
                          <svg
                              className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                          >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                                clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                    Posts are moderated
                  </span>
                        </div>
                      </div>
                    </div>

                    {/* Moderators section - Read-only for normal users */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mt-4">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Moderators
                        </h3>
                        {/*<button className="text-sm text-blue-500 dark:text-blue-400 hover:underline">*/}
                        {/*  View All*/}
                        {/*</button>*/}
                      </div>
                      <div className="p-4">
                        {/* Display moderators - No edit controls for normal users */}
                        {communityDetail?.community_admin && (
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md mb-2">
                              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                                <img
                                    src={communityDetail.community_admin.user_profile_image}
                                    alt={communityDetail.community_admin.user_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = '/default-avatar.png'; // fallback image
                                    }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white flex items-center">
                                  {communityDetail.community_admin.user_name}
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              Owner
            </span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Since {new Date(communityDetail.created_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                        )}
                        {/* Admin controls for moderators are moved to the settings modal */}
                      </div>
                    </div>
                  </div>

              )
          }
        </div>
      </div>

      {/* Community Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in p-2 md:p-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mx-auto max-h-[90vh] sm:max-h-[85vh] overflow-y-auto relative shadow-xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Community Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-full p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-0">
              {/* Tab navigation - mobil uyumlu */}
              <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-scroll scrollbar-hide -webkit-overflow-scrolling-touch">
                <div
                  className="flex px-3 sm:px-6 -mb-px w-max"
                  aria-label="Settings"
                >
                  <button
                    onClick={() => setActiveTab("basic")}
                    className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-3 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm transition flex-none ${
                      activeTab === "basic"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Basic Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("rules")}
                    className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-3 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm transition flex-none ${
                      activeTab === "rules"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Rules
                  </button>
                  <button
                    onClick={() => setActiveTab("moderators")}
                    className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-3 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm transition flex-none ${
                      activeTab === "moderators"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Moderators
                  </button>
                  <button
                    onClick={() => setActiveTab("appearance")}
                    className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-3 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm transition flex-none ${
                      activeTab === "appearance"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Appearance
                  </button>
                  <button
                    onClick={() => setActiveTab("access")}
                    className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-3 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm transition flex-none ${
                      activeTab === "access"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Access Requests
                  </button>
                  <button
                    onClick={() => setActiveTab("pending-posts")}
                    className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 mr-3 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm transition flex-none ${
                      activeTab === "pending-posts"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Pending Posts ({pendingPosts.length})
                  </button>
                </div>
              </div>

              {/* Scroll göstergesini ekleyelim */}
              <div className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 italic text-center md:hidden">
                <span>← Swipe Right to Scroll →</span>
              </div>

              {/* Settings content - mobil padding ayarları */}
              <div className="px-3 sm:px-6 py-4 sm:py-6">
                {/* Basic Settings */}
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Community Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="communityName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Community Name
                          </label>
                          <input
                            type="text"
                            id="communityName"
                            value={communitySettings.name}
                            onChange={(e) =>
                              setCommunitySettings((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            This is the display name of your community.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="communityDesc"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Community Description
                          </label>
                          <textarea
                            id="communityDesc"
                            rows={4}
                            value={communitySettings.description}
                            onChange={(e) =>
                              setCommunitySettings((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            This description will be displayed on your community
                            page. Maximum 500 characters.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rules Section */}
                {/*{activeTab === "rules" && (*/}
                {/*  <div className="space-y-6">*/}
                {/*    <div>*/}
                {/*      <div className="flex items-center justify-between mb-4">*/}
                {/*        <h3 className="text-lg font-medium text-gray-900 dark:text-white">*/}
                {/*          Community Rules*/}
                {/*        </h3>*/}
                {/*        <span className="text-sm text-gray-500 dark:text-gray-400">*/}
                {/*          {rules.length} {rules.length === 1 ? "rule" : "rules"}*/}
                {/*        </span>*/}
                {/*      </div>*/}

                {/*      /!*<div className="space-y-4">*!/*/}
                {/*      /!*  {rules.map((rule) => (*!/*/}
                {/*      /!*    <div*!/*/}
                {/*      /!*      key={rule.id}*!/*/}
                {/*      /!*      className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800"*!/*/}
                {/*      /!*    >*!/*/}
                {/*      /!*      <div className="p-4">*!/*/}
                {/*      /!*        <div className="flex justify-between">*!/*/}
                {/*      /!*          <div>*!/*/}
                {/*      /!*            <h4 className="font-medium text-gray-900 dark:text-white flex items-center">*!/*/}
                {/*      /!*              <span className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 h-6 w-6 text-xs font-semibold mr-2">*!/*/}
                {/*      /!*                {rule.id}*!/*/}
                {/*      /!*              </span>*!/*/}
                {/*      /!*              {rule.title}*!/*/}
                {/*      /!*            </h4>*!/*/}
                {/*      /!*            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">*!/*/}
                {/*      /!*              {rule.description}*!/*/}
                {/*      /!*            </p>*!/*/}
                {/*      /!*          </div>*!/*/}
                {/*      /!*          <div className="flex space-x-2 ml-4">*!/*/}
                {/*      /!*            <button*!/*/}
                {/*      /!*              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"*!/*/}
                {/*      /!*              title="Edit rule"*!/*/}
                {/*      /!*            >*!/*/}
                {/*      /!*              <svg*!/*/}
                {/*      /!*                xmlns="http://www.w3.org/2000/svg"*!/*/}
                {/*      /!*                className="h-5 w-5"*!/*/}
                {/*      /!*                viewBox="0 0 20 20"*!/*/}
                {/*      /!*                fill="currentColor"*!/*/}
                {/*      /!*              >*!/*/}
                {/*      /!*                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />*!/*/}
                {/*      /!*              </svg>*!/*/}
                {/*      /!*            </button>*!/*/}
                {/*      /!*            <button*!/*/}
                {/*      /!*              onClick={() => handleDeleteRule(rule.id)}*!/*/}
                {/*      /!*              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"*!/*/}
                {/*      /!*              title="Delete rule"*!/*/}
                {/*      /!*            >*!/*/}
                {/*      /!*              <svg*!/*/}
                {/*      /!*                xmlns="http://www.w3.org/2000/svg"*!/*/}
                {/*      /!*                className="h-5 w-5"*!/*/}
                {/*      /!*                viewBox="0 0 20 20"*!/*/}
                {/*      /!*                fill="currentColor"*!/*/}
                {/*      /!*              >*!/*/}
                {/*      /!*                <path*!/*/}
                {/*      /!*                  fillRule="evenodd"*!/*/}
                {/*      /!*                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"*!/*/}
                {/*      /!*                  clipRule="evenodd"*!/*/}
                {/*      /!*                />*!/*/}
                {/*      /!*              </svg>*!/*/}
                {/*      /!*            </button>*!/*/}
                {/*      /!*          </div>*!/*/}
                {/*      /!*        </div>*!/*/}
                {/*      /!*      </div>*!/*/}
                {/*      /!*    </div>*!/*/}
                {/*      /!*  ))}*!/*/}
                {/*      */}
                {/*      /!*  /!* Add Rule Form *!/*!/*/}
                {/*      /!*  <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800">*!/*/}
                {/*      /!*    <h4 className="font-medium text-gray-900 dark:text-white mb-3">*!/*/}
                {/*      /!*      Add New Rule*!/*/}
                {/*      /!*    </h4>*!/*/}
                {/*      /!*    <div className="space-y-3">*!/*/}
                {/*      /!*      <div>*!/*/}
                {/*      /!*        <label*!/*/}
                {/*      /!*          htmlFor="rule-title"*!/*/}
                {/*      /!*          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"*!/*/}
                {/*      /!*        >*!/*/}
                {/*      /!*          Rule Title*!/*/}
                {/*      /!*        </label>*!/*/}
                {/*      /!*        <input*!/*/}
                {/*      /!*          type="text"*!/*/}
                {/*      /!*          id="rule-title"*!/*/}
                {/*      /!*          value={newRule.title}*!/*/}
                {/*      /!*          onChange={(e) =>*!/*/}
                {/*      /!*            setNewRule({*!/*/}
                {/*      /!*              ...newRule,*!/*/}
                {/*      /!*              title: e.target.value,*!/*/}
                {/*      /!*            })*!/*/}
                {/*      /!*          }*!/*/}
                {/*      /!*          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"*!/*/}
                {/*      /!*          placeholder="Be respectful"*!/*/}
                {/*      /!*        />*!/*/}
                {/*      /!*      </div>*!/*/}
                {/*      /!*      <div>*!/*/}
                {/*      /!*        <label*!/*/}
                {/*      /!*          htmlFor="rule-desc"*!/*/}
                {/*      /!*          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"*!/*/}
                {/*      /!*        >*!/*/}
                {/*      /!*          Description*!/*/}
                {/*      /!*        </label>*!/*/}
                {/*      /!*        <textarea*!/*/}
                {/*      /!*          id="rule-desc"*!/*/}
                {/*      /!*          value={newRule.description}*!/*/}
                {/*      /!*          onChange={(e) =>*!/*/}
                {/*      /!*            setNewRule({*!/*/}
                {/*      /!*              ...newRule,*!/*/}
                {/*      /!*              description: e.target.value,*!/*/}
                {/*      /!*            })*!/*/}
                {/*      /!*          }*!/*/}
                {/*      /!*          rows={2}*!/*/}
                {/*      /!*          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"*!/*/}
                {/*      /!*          placeholder="Detailed explanation of the rule"*!/*/}
                {/*      /!*        />*!/*/}
                {/*      /!*      </div>*!/*/}
                {/*      /!*      <div className="flex justify-end">*!/*/}
                {/*      /!*        <button*!/*/}
                {/*      /!*          onClick={handleAddRule}*!/*/}
                {/*      /!*          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"*!/*/}
                {/*      /!*          disabled={*!/*/}
                {/*      /!*            !newRule.title.trim() ||*!/*/}
                {/*      /!*            !newRule.description.trim()*!/*/}
                {/*      /!*          }*!/*/}
                {/*      /!*        >*!/*/}
                {/*      /!*          Add Rule*!/*/}
                {/*      /!*        </button>*!/*/}
                {/*      /!*      </div>*!/*/}
                {/*      /!*    </div>*!/*/}
                {/*      /!*  </div>*!/*/}
                {/*      /!*</div>*!/*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*)}*/}

                {/* Moderator Section */}
                {activeTab === "moderators" && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Moderators
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {communityDetail?.community_admin?.length}{" "}
                          {communityDetail?.community_admin?.length === 1 ? "moderator" : "moderators"}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        {communityDetail?.community_admin.map((mod:any) => (
                          <div
                            key={mod.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800"
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                  <div className="h-10 w-10 rounded-full flex-shrink-0 bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                                    {mod.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <p className="font-medium text-gray-900 dark:text-white">
                                        {mod.username}
                                      </p>
                                      {/*<span*/}
                                      {/*  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${*/}
                                      {/*    moderatorRoles[mod.role].color*/}
                                      {/*  }`}*/}
                                      {/*>*/}
                                      {/*  {mod.role}*/}
                                      {/*</span>*/}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Since {mod.joinedDate}
                                    </p>
                                  </div>
                                </div>
                                {mod.role !== "Owner" && (
                                  <div className="flex items-center">
                                    <select
                                      value={mod.role}
                                      onChange={(e) =>
                                        handleUpdateModeratorRole(
                                          mod.id,
                                          e.target.value
                                        )
                                      }
                                      className="ml-2 text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                      <option value="Admin">Admin</option>
                                      <option value="Moderator">
                                        Moderator
                                      </option>
                                    </select>
                                    <button
                                      onClick={() =>
                                        handleRemoveModerator(mod.id)
                                      }
                                      className="ml-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      title="Remove moderator"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Permissions */}
                              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Permissions
                                </h5>
                                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-2">*/}
                                {/*  {Object.entries(mod.permissions).map(*/}
                                {/*    ([permission, value]) => (*/}
                                {/*      <div*/}
                                {/*        key={permission}*/}
                                {/*        className="flex items-center"*/}
                                {/*      >*/}
                                {/*        <input*/}
                                {/*          type="checkbox"*/}
                                {/*          id={`${mod.id}-${permission}`}*/}
                                {/*          checked={value}*/}
                                {/*          onChange={(e) =>*/}
                                {/*            handleUpdatePermission(*/}
                                {/*              mod.id,*/}
                                {/*              permission,*/}
                                {/*              e.target.checked*/}
                                {/*            )*/}
                                {/*          }*/}
                                {/*          disabled={mod.role === "Owner"}*/}
                                {/*          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"*/}
                                {/*        />*/}
                                {/*        /!*<label*!/*/}
                                {/*        /!*  htmlFor={`${mod.id}-${permission}`}*!/*/}
                                {/*        /!*  className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize"*!/*/}
                                {/*        /!*>*!/*/}
                                {/*        /!*  {permission*!/*/}
                                {/*        /!*    .replace(/([A-Z])/g, " $1")*!/*/}
                                {/*        /!*    .trim()*!/*/}
                                {/*        /!*    .replace(/^\w/, (c) =>*!/*/}
                                {/*        /!*      c.toUpperCase()*!/*/}
                                {/*        /!*    )}*!/*/}
                                {/*        /!*</label>*!/*/}
                                {/*      </div>*/}
                                {/*    )*/}
                                {/*  )}*/}
                                {/*</div>*/}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Moderator Form */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Add New Moderator
                        </h4>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newModerator}
                            onChange={(e) => setNewModerator(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Username"
                          />
                          <button
                            onClick={handleAddModerator}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                            disabled={!newModerator.trim()}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Section */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Community Appearance
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Theme Color
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {[
                              "#ff4500",
                              "#0079d3",
                              "#1da1f2",
                              "#ff8717",
                              "#46d160",
                              "#772ce8",
                              "#5a75e6",
                              "#ff66ac",
                              "#00b8d9",
                              "#00c781",
                            ].map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                  community?.color === color
                                    ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 dark:ring-offset-gray-800"
                                    : ""
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              ></button>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            This color will be used as the accent color for your
                            community?.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Banner Image
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              {community?.bannerImage ? (
                                <div className="mb-3">
                                  <img
                                    src={community?.bannerImage}
                                    alt="Community banner"
                                    className="mx-auto h-32 object-cover rounded"
                                  />
                                </div>
                              ) : (
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                              <div className="flex text-sm justify-center">
                                <label
                                  htmlFor="banner-upload"
                                  className="relative cursor-pointer px-3 py-1.5 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800"
                                >
                                  <span>Upload a new image</span>
                                  <input
                                    id="banner-upload"
                                    name="banner-upload"
                                    type="file"
                                    className="sr-only"
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Access Requests Section */}
                {activeTab === "access" && (
                  <div className="space-y-8">
                    {/* Invite Link Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Community Invitation
                      </h3>

                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          Share this link with people you want to invite to your
                          community?. Anyone with this link can request to join.
                        </p>

                        <div className="flex">
                          <input
                            type="text"
                            value={inviteLink}
                            readOnly
                            className="flex-grow px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(inviteLink);
                              alert("Invite link copied to clipboard!");
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Copy
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <button
                            onClick={() => {
                              const newCode = Math.random()
                                .toString(36)
                                .substring(2, 15);
                              setInviteLink(
                                `https://community?.example.com/join/running-club?code=${newCode}`
                              );
                            }}
                            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            Generate New Link
                          </button>

                          <div className="flex items-center">
                            <input
                              id="autoApprove"
                              type="checkbox"
                              checked={autoApprove}
                              onChange={() => setAutoApprove(!autoApprove)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                            />
                            <label
                              htmlFor="autoApprove"
                              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                              Auto-approve requests
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pending Requests Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Pending Join Requests
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {pendingRequests.length}{" "}
                          {pendingRequests.length === 1
                            ? "request"
                            : "requests"}
                        </span>
                      </div>

                      {pendingRequests.length > 0 ? (
                        <div className="space-y-4">
                          {pendingRequests.map((request) => (
                            <div
                              key={request.id}
                              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                            >
                              <div className="p-4">
                                <div className="flex items-start">
                                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                                    {request.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900 dark:text-white">
                                        u/{request.username}
                                      </h4>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Requested{" "}
                                        {formatTimeAgo(request.requestDate)}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                      {request.message}
                                    </p>
                                    <div className="mt-3 flex space-x-3">
                                      <button
                                        onClick={() => {
                                          // In a real application, call API to approve
                                          setPendingRequests(
                                            pendingRequests.filter(
                                              (req) => req.id !== request.id
                                            )
                                          );
                                          alert(
                                            `User ${request.username} has been approved.`
                                          );
                                        }}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => {
                                          // In a real application, call API to reject
                                          setPendingRequests(
                                            pendingRequests.filter(
                                              (req) => req.id !== request.id
                                            )
                                          );
                                          alert(
                                            `User ${request.username} has been rejected.`
                                          );
                                        }}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition"
                                      >
                                        Reject
                                      </button>
                                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition">
                                        View Profile
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No pending requests
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            When someone requests to join your community,
                            they'll appear here.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Approved Users Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Access Settings
                      </h3>

                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Member Approval Requirements
                              </h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Configure what information users need to provide
                                when requesting to join.
                              </p>
                            </div>
                            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                              Configure
                            </button>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Approved Members
                              </h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage users who have already been approved to
                                join your community?.
                              </p>
                            </div>
                            <button className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                              View All
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending Posts Section */}
                {activeTab === "pending-posts" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Posts Awaiting Approval
                      </h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                          {pendingPosts.length}{" "}
                          {pendingPosts.length === 1 ? "post" : "posts"} pending
                          review
                        </span>

                        <div className="relative">
                          <select
                            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            defaultValue="newest"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {pendingPosts.length > 0 ? (
                      <div className="space-y-6">
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          No pending posts
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          All posts have been reviewed. Check back later for new
                          submissions.
                        </p>
                      </div>
                    )}

                    {/* Auto Approval Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Approval Settings
                      </h3>

                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Auto-Approval Rules
                              </h4>
                              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                                Configure
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Set up rules to automatically approve or reject
                              posts based on criteria such as user karma,
                              account age, or post content.
                            </p>
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center">
                                <input
                                  id="auto_trusted"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <label
                                  htmlFor="auto_trusted"
                                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  Auto-approve posts from trusted members
                                </label>
                              </div>

                              <div className="flex items-center">
                                <input
                                  id="auto_keywords"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <label
                                  htmlFor="auto_keywords"
                                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  Auto-reject posts containing banned keywords
                                </label>
                              </div>

                              <div className="flex items-center">
                                <input
                                  id="notify_mods"
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="notify_mods"
                                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  Notify moderators of new pending posts
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCommunity}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors"
                >
                  Delete Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto shadow-xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ban User: {userToBan?.username}
              </h3>
              <button
                onClick={() => setShowBanModal(false)}
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="ban-reason"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Ban Reason
                </label>
                <textarea
                  id="ban-reason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Explain the reason for banning this user..."
                />
              </div>

              <div>
                <label
                  htmlFor="ban-duration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Ban Duration
                </label>
                <select
                  id="ban-duration"
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="24h">24 Hours</option>
                  <option value="3d">3 Days</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="permanent">Permanent</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  User will not be able to interact with this community for the
                  selected period.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={!banReason.trim()}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors ${
                  banReason.trim()
                    ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    : "bg-red-400 cursor-not-allowed"
                }`}
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      {/*<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">*/}
      {/*    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">*/}
      {/*        <div className="bg-blue-100 p-3 rounded-full">*/}
      {/*            <Building2 className="w-6 h-6 text-blue-600" />*/}
      {/*        </div>*/}
      {/*        <div className="flex-1">*/}
      {/*            <h3 className="text-lg font-semibold text-blue-900">*/}
      {/*                Is this your company?*/}
      {/*            </h3>*/}
      {/*            <p className="text-blue-700 mb-4">*/}
      {/*                Verify your business now to take ownership of your profile and*/}
      {/*                connect with your customers.*/}
      {/*            </p>*/}
      {/*            <button*/}
      {/*                onClick={() => setIsVerificationModalOpen(true)}*/}
      {/*                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"*/}
      {/*            >*/}
      {/*                GET FREE ACCOUNT*/}
      {/*            </button>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/* Delete Community Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto shadow-xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Delete Community
              </h3>
            </div>

            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600 dark:text-red-400"
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
                </div>

                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  Are you sure you want to delete this community?
                </h3>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <p className="mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      r/{community?.name}
                    </span>{" "}
                    will be permanently deleted.
                  </p>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    This action cannot be undone!
                  </p>
                </div>

                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>Warning:</strong> All posts, comments, members, and
                    data associated with this community will be permanently
                    removed.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const result = await dispatch(
                      setCommunityDelete({
                        project: {},
                      })
                    );

                    if (result.payload && result.payload.status === true) {
                      alert("Community deleted successfully!");
                      setShowSettings(false);
                      window.location.href = "/";
                    } else {
                      throw new Error(
                        result.payload?.message || "Delete failed"
                      );
                    }
                  } catch (error) {}
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Delete Community
              </button>
            </div>
          </div>
        </div>
      )}
      <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
      />
    </div>

  );
};

export default CommunityGroup;
