import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  Dot,
  ShoppingBag,
  Star,
  Users,
  X,
  Trash2,
  CheckCheck,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  useCommunityNotifications,
  useMarkNotificationsAsSeen,
  useDeleteAllNotifications,
} from "@/hooks/useCommunityNotifications";

// Window size hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

// Notification types
type NotificationType = "review" | "community" | "system";

// Backend community notification types
type CommunityNotificationType = "1" | "2" | "3" | "4" | "5";

interface CommunityNotification {
  notification_id: string;
  notification_type: CommunityNotificationType;
  user_id: string;
  to_user_id: string;
  post_id: string;
  community_id: string;
  seen_status: string;
  created_date: string;
  updated_date: string;
  user_name?: string;
  // Optionally add more fields as needed
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  image?: string;
  icon?: React.ReactNode;
}

// Simplified props - we'll manage isOpen state internally
interface NotificationProps {
  hasUnreadDefault?: boolean; // Optional with default value
}

const Notification: React.FC<NotificationProps> = ({
                                                     hasUnreadDefault = false,
                                                   }) => {
  // Internal state management
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(hasUnreadDefault);
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const { data: communityNotificationListData } = useCommunityNotifications({
    limit: 10,
    offset: 0,
    project: {},
  });
  const markAsSeenMutation = useMarkNotificationsAsSeen();
  const deleteAllMutation = useDeleteAllNotifications();

  // Toggle function to open/close the notification panel
  const toggleNotification = () => {
    setIsOpen((prev) => !prev);
    setShowActionsMenu(false);
  };

  // Function to close the notification panel
  const closeNotification = () => {
    setIsOpen(false);
    setShowActionsMenu(false);
  };

  // Toggle actions menu
  const toggleActionsMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionsMenu((prev) => !prev);
  };

  // Fetch community notifications is handled by TanStack Query hook

  const mapCommunityNotification = (n: CommunityNotification): Notification => {
    const typeNum = Number(n.notification_type);
    let title = "";
    let message = "";
    let icon: React.ReactNode = <Users className="w-4 h-4 text-purple-500" />;
    switch (typeNum) {
      case 1:
        title = "Post Liked";
        message = `${n.user_name || "Someone"} liked your post.`;
        icon = <Star className="w-4 h-4 text-yellow-500" />;
        break;
      case 2:
        title = "New Comment";
        message = `${n.user_name || "Someone"} commented on your post.`;
        icon = <Users className="w-4 h-4 text-purple-500" />;
        break;
      case 3:
        title = "Poll Answered";
        message = `${n.user_name || "Someone"} answered your poll.`;
        icon = <Users className="w-4 h-4 text-purple-500" />;
        break;
      case 4:
        title = "New Follower";
        message = `${n.user_name || "Someone"} started following you.`;
        icon = <Users className="w-4 h-4 text-purple-500" />;
        break;
      case 5:
        title = "Joined Community";
        message = `${n.user_name || "Someone"} joined your community.`;
        icon = <Users className="w-4 h-4 text-purple-500" />;
        break;
      default:
        title = "Community Notification";
        message = "";
        icon = <Users className="w-4 h-4 text-purple-500" />;
    }
    return {
      id: n.notification_id,
      type: "community",
      title,
      message,
      time: n.created_date,
      read: n.seen_status === "1",
      link:
          n.post_id && n.post_id !== "0"
              ? `/community/${n.community_id}/post/${n.post_id}`
              : n.user_name != undefined
                  ? `/profile/${n.user_name}`
                  : undefined,
      image: "https://ui-avatars.com/api/?name=CM&background=8b5cf6&color=fff",
      icon,
    };
  };

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
      ) {
        closeNotification();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark all as read
  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionsMenu(false);

    if (activeTab === "community" || activeTab === "all") {
      // Community bildirimlerini okundu olarak işaretle
      await markAsSeenMutation.mutateAsync({
        project: {},
      });
    }

    if (activeTab !== "community") {
      setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: true,
          }))
      );
      setHasUnread(false);
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionsMenu(false);

    if (activeTab === "community" || activeTab === "all") {
      // Community bildirimlerini sil
      await deleteAllMutation.mutateAsync({
        project: {},
      });
    }

    if (activeTab !== "community") {
      // Diğer bildirimleri local state'den sil
      if (activeTab === "all") {
        setNotifications([]);
      } else {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.type !== activeTab)
        );
      }
      setHasUnread(false);
    }
  };

  // Mark single notification as read
  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        )
    );

    // Check if there are still any unread notifications
    const stillHasUnread = notifications.some(
        (notification) => notification.id !== id && !notification.read
    );

    setHasUnread(stillHasUnread);
  };

  // Change active tab
  const changeTab = (tab: NotificationType | "all", e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(tab);
    setShowActionsMenu(false);
  };

  // Prevent click propagation on the dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Navigate to notification link
  const navigateToNotification = (
      notification: Notification,
      e: React.MouseEvent
  ) => {
    e.stopPropagation();

    // Mark notification as read when clicked
    if (!notification.read) {
      setNotifications((prevNotifications) =>
          prevNotifications.map((item) =>
              item.id === notification.id ? { ...item, read: true } : item
          )
      );

      // Update unread status if needed
      const stillHasUnread = notifications.some(
          (item) => item.id !== notification.id && !item.read
      );

      setHasUnread(stillHasUnread);
    }

    // Navigate to the link
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const filteredNotifications =
      activeTab === "all"
          ? [
            ...notifications,
            ...(Array.isArray(communityNotificationListData?.data)
                ? communityNotificationListData.data.map(mapCommunityNotification)
                : []),
          ]
          : activeTab === "community"
              ? Array.isArray(communityNotificationListData?.data)
                  ? communityNotificationListData.data.map(mapCommunityNotification)
                  : []
              : notifications.filter((notification) => notification.type === activeTab);

  // Count unread notifications
  const unreadCount = notifications.filter(
      (notification) => !notification.read
  ).length;

  // Count unread notifications by type
  const unreadReviews = notifications.filter(
      (n) => n.type === "review" && !n.read
  ).length;
  const unreadCommunity = filteredNotifications.filter(
      (n: any) => n.type === "community" && !n.read
  ).length;
  const unreadSystem = notifications.filter(
      (n) => n.type === "system" && !n.read
  ).length;

  // Animation variants for Framer Motion
  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      scale: 0.98,
      transition: {
        duration: 0.15,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: 8,
      transition: {
        duration: 0.15,
      },
    },
  };

  // Determine position based on window size
  const getDropdownPosition = () => {
    if (isMobile) {
      return {
        position: "fixed" as const,
        top: "70px",
        left: "10px",
        transform: "none",
        width: "calc(100vw - 20px)",
        maxHeight: "calc(100vh - 90px)",
        zIndex: 1000,
      };
    }

    return {
      position: "absolute" as const,
      width: "min(95vw, 24rem)",
      maxHeight: "80vh",
      top: "100%",
      right: 0,
      zIndex: 50,
    };
  };

  // Close notifications when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeNotification();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  // Prevent body scroll when notification is open on mobile
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  return (
      <div className="relative">
        {/* Bell Icon Button with Animation */}
        <motion.button
            className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleNotification();
            }}
        >
          <Bell className="w-6 h-6 text-gray-700" />
        </motion.button>

        {/* Notification Dropdown with Animation */}
        <AnimatePresence>
          {isOpen && (
              <motion.div
                  ref={dropdownRef}
                  className={`bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ${
                      isMobile ? "overflow-y-auto" : ""
                  }`}
                  style={getDropdownPosition()}
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={handleDropdownClick}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">
                    Notifications
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Actions Menu Button */}
                    {filteredNotifications.length > 0 && (
                        <div className="relative">
                          <motion.button
                              onClick={toggleActionsMenu}
                              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </motion.button>

                          {/* Actions Dropdown */}
                          <AnimatePresence>
                            {showActionsMenu && (
                                <motion.div
                                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                >
                                  <motion.button
                                      onClick={markAllAsRead}
                                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                                  >
                                    <CheckCheck className="w-4 h-4 text-green-500" />
                                    <span>Mark all as read</span>
                                  </motion.button>
                                  <motion.button
                                      onClick={deleteAllNotifications}
                                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      whileHover={{ backgroundColor: "rgb(254 242 242)" }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete all</span>
                                  </motion.button>
                                </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                    )}

                    <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeNotification();
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-1.5 pt-1.5">
                  <motion.button
                      onClick={(e) => changeTab("all", e)}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          activeTab === "all"
                              ? "text-gray-900 bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: activeTab !== "all" ? 1.05 : 1 }}
                      whileTap={{ scale: 0.98 }}
                  >
                <span className="flex items-center">
                  All
                  {unreadCount > 0 && (
                      <motion.span
                          className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-600"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                      >
                        {unreadCount}
                      </motion.span>
                  )}
                </span>
                    {activeTab === "all" && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t-full"
                            layoutId="activeTabIndicator"
                        />
                    )}
                  </motion.button>
                  <motion.button
                      onClick={(e) => changeTab("review", e)}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          activeTab === "review"
                              ? "text-gray-900 bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: activeTab !== "review" ? 1.05 : 1 }}
                      whileTap={{ scale: 0.98 }}
                  >
                <span className="flex items-center">
                  Reviews
                  {unreadReviews > 0 && (
                      <motion.span
                          className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-[10px] font-semibold text-rose-600"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                      >
                        {unreadReviews}
                      </motion.span>
                  )}
                </span>
                    {activeTab === "review" && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t-full"
                            layoutId="activeTabIndicator"
                        />
                    )}
                  </motion.button>
                  <motion.button
                      onClick={(e) => changeTab("community", e)}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          activeTab === "community"
                              ? "text-gray-900 bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: activeTab !== "community" ? 1.05 : 1 }}
                      whileTap={{ scale: 0.98 }}
                  >
                <span className="flex items-center">
                  Community
                  {unreadCommunity > 0 && (
                      <motion.span
                          className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-[10px] font-semibold text-purple-600"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                      >
                        {unreadCommunity}
                      </motion.span>
                  )}
                </span>
                    {activeTab === "community" && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t-full"
                            layoutId="activeTabIndicator"
                        />
                    )}
                  </motion.button>
                  <motion.button
                      onClick={(e) => changeTab("system", e)}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          activeTab === "system"
                              ? "text-gray-900 bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: activeTab !== "system" ? 1.05 : 1 }}
                      whileTap={{ scale: 0.98 }}
                  >
                <span className="flex items-center">
                  System
                  {unreadSystem > 0 && (
                      <motion.span
                          className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-600"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                      >
                        {unreadSystem}
                      </motion.span>
                  )}
                </span>
                    {activeTab === "system" && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t-full"
                            layoutId="activeTabIndicator"
                        />
                    )}
                  </motion.button>
                </div>

                {/* Notifications List with Animations */}
                <div className="overflow-y-auto max-h-[calc(80vh-150px)] py-1">
                  <AnimatePresence mode="wait">
                    {filteredNotifications.length === 0 ? (
                        <motion.div
                            className="flex flex-col items-center justify-center py-12 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            key="empty"
                        >
                          <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.3 }}
                              className="bg-gray-50 p-4 rounded-full mb-4"
                          >
                            <Bell className="w-8 h-8 text-gray-400" />
                          </motion.div>
                          <p className="text-gray-500 text-sm font-medium">
                            No notifications
                          </p>
                          <p className="text-gray-400 text-xs mt-1 max-w-xs">
                            When you get notifications, they'll show up here
                          </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="notification-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                          {filteredNotifications.map(
                              (notification: any, index: any) => (
                                  <motion.div
                                      key={notification.id}
                                      className={`relative px-4 py-3 ${
                                          notification.read ? "bg-white" : "bg-gray-50"
                                      } hover:bg-gray-50 transition-colors cursor-pointer group`}
                                      variants={listItemVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                      custom={index}
                                      layoutId={notification.id}
                                      onClick={(e) =>
                                          navigateToNotification(notification, e)
                                      }
                                      whileHover={{
                                        backgroundColor: notification.link
                                            ? "rgb(243, 244, 246)"
                                            : undefined,
                                        x: notification.link ? 2 : 0,
                                      }}
                                  >
                                    <div className="flex gap-3">
                                      {/* Avatar with Badge */}
                                      <div className="flex-shrink-0">
                                        <div className="relative">
                                          <img
                                              src={notification.image}
                                              alt=""
                                              className="w-10 h-10 rounded-full border border-gray-200"
                                          />
                                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[3px] shadow-sm border border-gray-100">
                                            {notification.icon}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Content - left aligned */}
                                      <div className="flex-1 min-w-0 relative text-left">
                                        {!notification.read && (
                                            <span className="absolute left-[-12px] top-1.5">
                                  <Dot className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                                </span>
                                        )}

                                        <div className="flex items-start justify-between">
                                          <h4 className="text-sm font-medium text-gray-900 truncate max-w-[170px] text-left">
                                            {notification.title}
                                          </h4>
                                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {notification.time}
                                </span>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-0.5 mb-2 line-clamp-2 text-left">
                                          {notification.message}
                                        </p>
                                      </div>
                                    </div>

                                    {notification.link && (
                                        <motion.div
                                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            animate={{ x: [0, 3, 0] }}
                                            transition={{
                                              repeat: Infinity,
                                              repeatType: "reverse",
                                              duration: 1.5,
                                              ease: "easeInOut",
                                            }}
                                        >
                                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                                        </motion.div>
                                    )}
                                  </motion.div>
                              )
                          )}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default Notification;