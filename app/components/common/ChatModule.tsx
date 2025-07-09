import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  ChevronDown,
  Send,
  Plus,
  Search,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Mic,
  Users,
  User as UserIcon,
  ArrowLeft,
} from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "contact";
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: Date;
  unreadCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  isPremiumBrand?: boolean;
  isImportant?: boolean;
}

interface ChatModuleProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientAvatar: string;
}

// Sample contacts
const sampleContacts: Contact[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    status: "online",
    unreadCount: 3,
    lastMessage: {
      content: "Hey, how are you doing?",
      timestamp: new Date(Date.now() - 25 * 60000),
    },
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    status: "online",
    unreadCount: 0,
    lastMessage: {
      content: "The project is almost done!",
      timestamp: new Date(Date.now() - 45 * 60000),
    },
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    status: "away",
    lastSeen: new Date(Date.now() - 30 * 60000),
    unreadCount: 0,
    lastMessage: {
      content: "I'll send you the design files tomorrow",
      timestamp: new Date(Date.now() - 2 * 3600000),
    },
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    status: "offline",
    lastSeen: new Date(Date.now() - 1 * 86400000),
    unreadCount: 0,
    lastMessage: {
      content: "Great meeting you today!",
      timestamp: new Date(Date.now() - 1 * 86400000),
    },
  },
  {
    id: 5,
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    status: "online",
    unreadCount: 1,
    lastMessage: {
      content: "Did you see that new restaurant?",
      timestamp: new Date(Date.now() - 10 * 60000),
    },
  },
  {
    id: 6,
    name: "Lisa Wang",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    status: "offline",
    lastSeen: new Date(Date.now() - 3 * 86400000),
    unreadCount: 0,
    lastMessage: {
      content: "Thanks for your help yesterday!",
      timestamp: new Date(Date.now() - 3 * 86400000),
    },
  },
  {
    id: 7,
    name: "Nike Support",
    avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    status: "online",
    unreadCount: 2,
    isPremiumBrand: true,
    isImportant: true,
    lastMessage: {
      content: "Your custom order has been shipped!",
      timestamp: new Date(Date.now() - 4 * 60000),
    },
  },
  {
    id: 8,
    name: "Adidas Team",
    avatar: "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
    status: "online",
    unreadCount: 1,
    isPremiumBrand: true,
    isImportant: true,
    lastMessage: {
      content: "Limited edition release - You're invited!",
      timestamp: new Date(Date.now() - 45 * 60000),
    },
  },
  {
    id: 9,
    name: "SportConnect",
    avatar: "https://ui-avatars.com/api/?name=SC&background=6366f1&color=fff",
    status: "online",
    unreadCount: 1,
    isImportant: true,
    lastMessage: {
      content: "Security alert: New login from Chrome on Mac",
      timestamp: new Date(Date.now() - 12 * 60000),
    },
  },
];

// Sample conversation history
const sampleConversations: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      content: "Hey there! How's your project going?",
      sender: "contact",
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
    },
    {
      id: 2,
      content: "It's going well, thanks! I'm just finalizing some details.",
      sender: "user",
      timestamp: new Date(Date.now() - 55 * 60000),
      read: true,
    },
    {
      id: 3,
      content: "That's great to hear! Do you think you'll finish on time?",
      sender: "contact",
      timestamp: new Date(Date.now() - 53 * 60000),
      read: true,
    },
    {
      id: 4,
      content:
        "I should be able to. There are a few challenges but nothing major.",
      sender: "user",
      timestamp: new Date(Date.now() - 50 * 60000),
      read: true,
    },
    {
      id: 5,
      content: "Let me know if you need any help!",
      sender: "contact",
      timestamp: new Date(Date.now() - 35 * 60000),
      read: true,
    },
    {
      id: 6,
      content: "Hey, are you available for a quick chat?",
      sender: "contact",
      timestamp: new Date(Date.now() - 25 * 60000),
      read: false,
    },
  ],
  2: [
    {
      id: 1,
      content: "Hi there! I've been reviewing the latest designs.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3 * 86400000),
      read: true,
    },
    {
      id: 2,
      content: "What do you think of them?",
      sender: "user",
      timestamp: new Date(Date.now() - 3 * 86400000 + 5 * 60000),
      read: true,
    },
    {
      id: 3,
      content:
        "They look great! I especially like the color palette you chose.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3 * 86400000 + 10 * 60000),
      read: true,
    },
    {
      id: 4,
      content: "The project is almost done!",
      sender: "contact",
      timestamp: new Date(Date.now() - 45 * 60000),
      read: true,
    },
  ],
  5: [
    {
      id: 1,
      content: "Hey, have you tried that new cafe downtown?",
      sender: "contact",
      timestamp: new Date(Date.now() - 2 * 86400000),
      read: true,
    },
    {
      id: 2,
      content: "Not yet, is it good?",
      sender: "user",
      timestamp: new Date(Date.now() - 2 * 86400000 + 30 * 60000),
      read: true,
    },
    {
      id: 3,
      content: "It's amazing! Great coffee and pastries.",
      sender: "contact",
      timestamp: new Date(Date.now() - 1 * 86400000),
      read: true,
    },
    {
      id: 4,
      content: "Did you see that new restaurant that opened next to it?",
      sender: "contact",
      timestamp: new Date(Date.now() - 10 * 60000),
      read: false,
    },
  ],
};

// Memoized contact item component for inbox
const ContactItem = memo(
  ({
    contact,
    onOpenConversation,
    formatMessageDate,
  }: {
    contact: Contact;
    onOpenConversation: (contact: Contact) => void;
    formatMessageDate: (date: Date) => string;
  }) => {
    return (
      <div
        onClick={() => onOpenConversation(contact)}
        className={`p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
          contact.unreadCount > 0 ? "bg-blue-50/50" : ""
        } ${
          contact.name === "SportConnect"
            ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm"
            : ""
        }`}
      >
        <div className="relative">
          <div
            className={`${
              contact.name === "SportConnect"
                ? "w-14 h-14 ring-2 ring-indigo-400"
                : "w-12 h-12"
            } rounded-full overflow-hidden`}
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`absolute bottom-0 right-0 ${
              contact.name === "SportConnect" ? "w-4 h-4" : "w-3 h-3"
            } rounded-full border-2 border-white ${
              contact.status === "online"
                ? "bg-green-500"
                : contact.status === "away"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
          ></span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center">
              <h4
                className={`font-medium ${
                  contact.name === "SportConnect"
                    ? "text-indigo-700 font-semibold"
                    : "text-gray-900"
                } truncate`}
              >
                {contact.name}
              </h4>
              {contact.isPremiumBrand && (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Twitter_Verified_Badge_Gold.svg/2560px-Twitter_Verified_Badge_Gold.svg.png"
                  alt="Verified"
                  className="ml-1.5 w-4 h-4"
                />
              )}
              {contact.isImportant &&
                !contact.isPremiumBrand &&
                contact.name !== "SportConnect" && (
                  <span className="ml-1.5 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-sm">
                    Important
                  </span>
                )}
              {contact.name === "SportConnect" && (
                <span className="ml-1.5 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                  Official
                </span>
              )}
            </div>
            {contact.lastMessage && (
              <span className="text-xs text-gray-500">
                {formatMessageDate(contact.lastMessage.timestamp)}
              </span>
            )}
          </div>

          {contact.lastMessage && (
            <p
              className={`text-sm ${
                contact.name === "SportConnect"
                  ? "text-indigo-900 font-medium"
                  : "text-gray-600"
              } truncate`}
            >
              {contact.lastMessage.content}
            </p>
          )}
        </div>

        {contact.unreadCount > 0 && (
          <div
            className={`${
              contact.name === "SportConnect" ? "bg-indigo-600" : "bg-blue-500"
            } text-white text-xs font-medium h-5 min-w-5 rounded-full flex items-center justify-center px-1.5`}
          >
            {contact.unreadCount}
          </div>
        )}
      </div>
    );
  }
);

// Memoized message component
const ChatMessage = memo(
  ({
    message,
    showDateSeparator,
    formattedDate,
    activeContact,
    formatTime,
  }: {
    message: Message;
    showDateSeparator: boolean;
    formattedDate: string;
    activeContact: Contact;
    formatTime: (date: Date) => string;
  }) => {
    return (
      <React.Fragment>
        {showDateSeparator && (
          <div className="text-center my-4">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formattedDate}
            </span>
          </div>
        )}

        <div
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex items-end gap-2 max-w-[75%]">
            {message.sender === "contact" && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-2 shadow-sm ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              <p>{message.content}</p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span
                  className={`text-xs ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>

                {message.sender === "user" && (
                  <span className="text-blue-100">✓✓</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

const ChatModule: React.FC<ChatModuleProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientAvatar,
}) => {
  const [activeView, setActiveView] = useState<
    "inbox" | "conversation" | "newConversation"
  >("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [conversations, setConversations] =
    useState<Record<number, Message[]>>(sampleConversations);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 600, height: 550 });
  const chatRef = useRef<HTMLDivElement>(null);
  const minSize = { width: 320, height: 400 };
  const maxSize = { width: 800, height: 700 };
  const [isMobile, setIsMobile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [newContactSearchQuery, setNewContactSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "important">(
    "all"
  );
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([
    {
      id: 10,
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
      status: "online",
      unreadCount: 0,
    },
    {
      id: 11,
      name: "Sophia Lee",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      status: "online",
      unreadCount: 0,
    },
    {
      id: 12,
      name: "James Martinez",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      status: "away",
      lastSeen: new Date(Date.now() - 20 * 60000),
      unreadCount: 0,
    },
    {
      id: 13,
      name: "Olivia Brown",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
      status: "offline",
      lastSeen: new Date(Date.now() - 5 * 86400000),
      unreadCount: 0,
    },
    {
      id: 14,
      name: "Ethan Taylor",
      avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c",
      status: "online",
      unreadCount: 0,
    },
  ]);

  // Optimize the checkMobile function using useCallback
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Initial mobile check
  useEffect(() => {
    // Initial check
    checkMobile();

    // Add event listener for resize with debouncing
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        checkMobile();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [checkMobile]);

  // Adjust chat size for mobile
  useEffect(() => {
    if (isMobile) {
      setChatSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [isMobile]);

  // Filter contacts based on search query and active tab
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        // First filter by search query
        const matchesSearch =
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (contact.lastMessage &&
            contact.lastMessage.content
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        // Then filter by active tab
        if (!matchesSearch) return false;

        // Only show SportConnect in Important tab
        if (contact.name === "SportConnect" && activeTab !== "important") {
          return false;
        }

        if (activeTab === "unread") {
          return contact.unreadCount > 0;
        } else if (activeTab === "important") {
          return contact.isImportant === true;
        }

        return true; // 'all' tab shows all contacts that match search
      })
      .sort((a, b) => {
        // Always put SportConnect at the top in the important tab
        if (activeTab === "important") {
          if (a.name === "SportConnect") return -1;
          if (b.name === "SportConnect") return 1;
        }
        return 0;
      });
  }, [contacts, searchQuery, activeTab]);

  // Get count of unread messages
  const unreadMessageCount = useMemo(() => {
    return contacts.reduce((total, contact) => total + contact.unreadCount, 0);
  }, [contacts]);

  // Get count of important messages
  const importantMessageCount = useMemo(() => {
    return contacts.filter((c) => c.isImportant).length;
  }, [contacts]);

  // Auto scroll to bottom when new messages arrive or conversation changes
  useEffect(() => {
    if (messagesEndRef.current && activeContact) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeContact]);

  // Open conversation with the initial recipient - modified to store contact but not immediately show conversation
  useEffect(() => {
    if (isOpen && recipientName) {
      // Find or create contact for the recipient
      const existingContact = contacts.find((c) => c.name === recipientName);

      if (!existingContact) {
        // Create new contact but don't immediately open conversation
        const newContact: Contact = {
          id: contacts.length + 1,
          name: recipientName,
          avatar: recipientAvatar,
          status: "online",
          unreadCount: 0,
        };

        setContacts((prev) => [...prev, newContact]);
      }

      // Always go to inbox view first
      setActiveView("inbox");
    }
  }, [isOpen, recipientName, recipientAvatar]);

  // Use optimized useCallback for handlers to prevent unnecessary re-renders
  const handleOpenConversation = useCallback(
    (contact: Contact) => {
      setActiveContact(contact);
      setActiveView("conversation");

      // Mark messages as read
      if (contact.unreadCount > 0) {
        // Update contact unread count
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
        );

        // Mark messages as read in conversation
        if (conversations[contact.id]) {
          setConversations((prev) => ({
            ...prev,
            [contact.id]: prev[contact.id].map((msg) =>
              msg.sender === "contact" && !msg.read
                ? { ...msg, read: true }
                : msg
            ),
          }));
        }
      }
    },
    [conversations]
  );

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !activeContact) return;

    const newMessage: Message = {
      id: conversations[activeContact.id]?.length
        ? Math.max(...conversations[activeContact.id].map((m) => m.id)) + 1
        : 1,
      content: messageInput,
      sender: "user",
      timestamp: new Date(),
      read: true,
    };

    // Add message to conversation
    setConversations((prev) => ({
      ...prev,
      [activeContact.id]: prev[activeContact.id]
        ? [...prev[activeContact.id], newMessage]
        : [newMessage],
    }));

    // Update contact's last message
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContact.id
          ? {
              ...c,
              lastMessage: {
                content: messageInput,
                timestamp: new Date(),
              },
            }
          : c
      )
    );

    setMessageInput("");

    // Simulate reply after a random delay
    if (Math.random() > 0.3) {
      // 70% chance to get a reply
      const replyDelay = 1000 + Math.random() * 4000; // 1-5 seconds

      setTimeout(() => {
        const replies = [
          "That sounds interesting!",
          "I understand what you mean.",
          "Let's discuss this further.",
          "Thanks for letting me know.",
          "I'll think about it and get back to you.",
          "Could you provide more details?",
          "That's a great idea!",
          "I'm not sure I follow, can you explain?",
          "I appreciate your perspective.",
          "Let's schedule a meeting to talk about this.",
        ];

        const replyMessage: Message = {
          id: conversations[activeContact.id]?.length
            ? Math.max(...conversations[activeContact.id].map((m) => m.id)) + 1
            : 1,
          content: replies[Math.floor(Math.random() * replies.length)],
          sender: "contact",
          timestamp: new Date(),
          read: true,
        };

        setConversations((prev) => ({
          ...prev,
          [activeContact.id]: [...prev[activeContact.id], replyMessage],
        }));

        // Update contact's last message
        setContacts((prev) =>
          prev.map((c) =>
            c.id === activeContact.id
              ? {
                  ...c,
                  lastMessage: {
                    content: replyMessage.content,
                    timestamp: new Date(),
                  },
                }
              : c
          )
        );
      }, replyDelay);
    }
  }, [messageInput, activeContact, conversations]);

  // Memoize functions that don't change often
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const formatMessageDate = useCallback(
    (date: Date) => {
      const now = new Date();
      const diffInDays =
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays < 1) {
        return formatTime(date);
      } else if (diffInDays < 2) {
        return "Yesterday";
      } else if (diffInDays < 7) {
        return date.toLocaleDateString(undefined, { weekday: "long" });
      } else {
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
    },
    [formatTime]
  );

  const handleStartNewConversation = useCallback(() => {
    setActiveView("newConversation");
    setNewContactSearchQuery("");
  }, []);

  const handleSelectNewContact = useCallback(
    (contact: Contact) => {
      // Add contact to contacts list if not already there
      if (!contacts.some((c) => c.id === contact.id)) {
        setContacts((prev) => [...prev, contact]);
      }

      // Open conversation with the selected contact
      handleOpenConversation(contact);
    },
    [contacts, handleOpenConversation]
  );

  const handleCreateCustomContact = useCallback(() => {
    if (!newContactSearchQuery.trim()) return;

    const newContact: Contact = {
      id: Date.now(), // Use timestamp as unique ID
      name: newContactSearchQuery,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newContactSearchQuery
      )}&background=random&color=fff`,
      status: "online",
      unreadCount: 0,
    };

    // Add to contacts
    setContacts((prev) => [...prev, newContact]);

    // Open conversation with the new contact
    handleOpenConversation(newContact);
  }, [newContactSearchQuery, handleOpenConversation]);

  // Memoize filtered lists to prevent re-computation on every render
  const filteredAvailableContacts = useMemo(() => {
    return availableContacts.filter((contact) =>
      contact.name.toLowerCase().includes(newContactSearchQuery.toLowerCase())
    );
  }, [availableContacts, newContactSearchQuery]);

  // Optimize animations
  const minimizedAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.15 },
  };

  const chatWindowAnimation = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 30, scale: 0.95 },
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1], // custom bezier curve for a snappier animation
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {isMinimized ? (
            // Minimized chat bubble with optimized animation
            <motion.div
              {...minimizedAnimation}
              className="fixed bottom-4 right-4 z-50 cursor-pointer"
              onClick={() => setIsMinimized(false)}
            >
              <div className="relative">
                {/* Minimized chat icon */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                  {activeContact ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                      <img
                        src={activeContact.avatar}
                        alt={activeContact.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <MessageSquare className="w-7 h-7" />
                  )}
                </div>

                {/* Notification badge with safe access to activeContact */}
                {activeContact && activeContact.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeContact.unreadCount}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // Full chat window with optimized animation
            <motion.div
              ref={chatRef}
              {...chatWindowAnimation}
              className={`
                fixed bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200 flex flex-col
                ${
                  isMobile
                    ? "inset-0 rounded-none"
                    : isMaximized
                    ? "inset-5 rounded-xl"
                    : "bottom-4 right-4"
                }
              `}
              style={{
                width: isMobile
                  ? "100%"
                  : isMaximized
                  ? "auto"
                  : `${chatSize.width}px`,
                height: isMobile
                  ? "100%"
                  : isMaximized
                  ? "auto"
                  : `${chatSize.height}px`,
                resize: isMobile || isMaximized ? "none" : "both",
                maxWidth: isMobile
                  ? "100%"
                  : isMaximized
                  ? "100%"
                  : `${maxSize.width}px`,
                maxHeight: isMobile
                  ? "100%"
                  : isMaximized
                  ? "100%"
                  : `${maxSize.height}px`,
                minWidth: isMobile ? "100%" : `${minSize.width}px`,
                minHeight: isMobile ? "100%" : `${minSize.height}px`,
                transform: "translate3d(0,0,0)", // Force GPU acceleration
                backfaceVisibility: "hidden",
                perspective: 1000,
                willChange: "transform, opacity",
              }}
              onMouseUp={() => {
                if (!isMobile && !isMaximized && chatRef.current) {
                  const { offsetWidth, offsetHeight } = chatRef.current;
                  setChatSize({ width: offsetWidth, height: offsetHeight });
                }
              }}
            >
              {/* Resize handle - only show on desktop and when not maximized */}
              {!isMobile && !isMaximized && (
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-50 hover:opacity-100">
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 22H20V20H22V22ZM16 22H18V20H16V22ZM14 22H12V20H14V22ZM10 22H8V20H10V22ZM6 22H4V20H6V22ZM2 22H0V20H2V22ZM22 18H20V16H22V18ZM22 14H20V12H22V14ZM22 10H20V8H22V10ZM22 6H20V4H22V6ZM22 2H20V0H22V2Z" />
                  </svg>
                </div>
              )}

              {/* Chat header */}
              <div
                className={`
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md
                ${isMobile ? "p-4 sticky top-0 z-10" : "p-5"}
              `}
              >
                <div className="flex items-center">
                  {(activeView === "conversation" ||
                    activeView === "newConversation") && (
                    <button
                      onClick={() => setActiveView("inbox")}
                      className="mr-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}

                  {activeView === "inbox" && (
                    <div className="flex items-center">
                      <MessageSquare
                        className={`${
                          isMobile ? "w-5 h-5 mr-2" : "w-6 h-6 mr-3"
                        }`}
                      />
                      <h3
                        className={`font-medium ${
                          isMobile ? "text-lg" : "text-xl"
                        }`}
                      >
                        Messages
                      </h3>
                    </div>
                  )}

                  {activeView === "newConversation" && (
                    <div className="flex items-center">
                      <Users
                        className={`${
                          isMobile ? "w-5 h-5 mr-2" : "w-6 h-6 mr-3"
                        }`}
                      />
                      <h3
                        className={`font-medium ${
                          isMobile ? "text-lg" : "text-xl"
                        }`}
                      >
                        New Conversation
                      </h3>
                    </div>
                  )}

                  {activeView === "conversation" && activeContact && (
                    <div className="flex items-center">
                      <div
                        className={`rounded-full overflow-hidden mr-3 ring-2 ring-white/30 ${
                          isMobile ? "w-10 h-10" : "w-12 h-12"
                        }`}
                      >
                        <img
                          src={activeContact.avatar}
                          alt={activeContact.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3
                            className={`font-medium ${
                              isMobile ? "text-base" : "text-lg"
                            }`}
                          >
                            {activeContact.name}
                          </h3>
                          {activeContact.isPremiumBrand && (
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Twitter_Verified_Badge_Gold.svg/2560px-Twitter_Verified_Badge_Gold.svg.png"
                              alt="Verified"
                              className="ml-2 w-5 h-5"
                            />
                          )}
                        </div>
                        <span
                          className={`text-white/80 flex items-center ${
                            isMobile ? "text-xs" : "text-sm"
                          }`}
                        >
                          {activeContact.status === "online" && (
                            <>
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                              Online
                            </>
                          )}
                          {activeContact.status === "away" && (
                            <>
                              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></span>
                              Away
                            </>
                          )}
                          {activeContact.status === "offline" && (
                            <>
                              <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                              {activeContact.lastSeen
                                ? `Last seen ${formatMessageDate(
                                    activeContact.lastSeen
                                  )}`
                                : "Offline"}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center ${
                    isMobile ? "gap-2" : "gap-3"
                  }`}
                >
                  {/* Maximize/Minimize button */}
                  {isMaximized ? (
                    <button
                      onClick={() => setIsMaximized(false)}
                      className={`rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                        isMobile ? "p-1.5" : "p-2"
                      }`}
                      title="Restore"
                    >
                      <svg
                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          rx="2"
                          ry="2"
                        />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsMaximized(true)}
                      className={`rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                        isMobile ? "p-1.5" : "p-2"
                      }`}
                      title="Maximize"
                    >
                      <svg
                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    </button>
                  )}

                  {/* Minimize button */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className={`rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                      isMobile ? "p-1.5" : "p-2"
                    }`}
                    title="Minimize"
                  >
                    <ChevronDown
                      className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                    />
                  </button>

                  <button
                    onClick={onClose}
                    className={`rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                      isMobile ? "p-1.5" : "p-2"
                    }`}
                  >
                    <X className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Inbox view */}
                {activeView === "inbox" && (
                  <div className="w-full flex flex-col h-full">
                    {/* Search box */}
                    <div className="p-3 border-b">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                      <button
                        onClick={() => setActiveTab("all")}
                        className={`flex-1 py-3 relative font-medium ${
                          activeTab === "all"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                      >
                        <span>All Messages</span>
                        {activeTab === "all" && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("unread")}
                        className={`flex-1 py-3 relative font-medium ${
                          activeTab === "unread"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          Unread
                          {unreadMessageCount > 0 && (
                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium rounded-full w-5 h-5">
                              {unreadMessageCount}
                            </span>
                          )}
                        </span>
                        {activeTab === "unread" && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("important")}
                        className={`flex-1 py-3 relative font-medium ${
                          activeTab === "important"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        } transition-colors`}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          Important
                          {importantMessageCount > 0 && (
                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium rounded-full w-5 h-5">
                              {importantMessageCount}
                            </span>
                          )}
                        </span>
                        {activeTab === "important" && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                        )}
                      </button>
                    </div>

                    {/* Contact list with memoized components */}
                    <div className="flex-1 overflow-y-auto">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                          <ContactItem
                            key={contact.id}
                            contact={contact}
                            onOpenConversation={handleOpenConversation}
                            formatMessageDate={formatMessageDate}
                          />
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-800 mb-1">
                            {activeTab === "unread"
                              ? "No unread messages"
                              : activeTab === "important"
                              ? "No important messages"
                              : "No messages found"}
                          </h3>
                          <p className="text-gray-500 mb-6">
                            {searchQuery
                              ? `No results for "${searchQuery}"`
                              : activeTab === "unread"
                              ? "You've read all your messages"
                              : activeTab === "important"
                              ? "No important messages to display"
                              : "Start a conversation with someone"}
                          </p>
                          <button
                            onClick={handleStartNewConversation}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            New Message
                          </button>
                        </div>
                      )}
                    </div>

                    {/* New message button */}
                    <div className="p-3 border-t mt-auto">
                      <button
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        onClick={handleStartNewConversation}
                      >
                        <Plus className="w-4 h-4" />
                        Start New Conversation
                      </button>
                    </div>
                  </div>
                )}

                {/* New Conversation View */}
                {activeView === "newConversation" && (
                  <div className="w-full flex flex-col h-full">
                    <div className="p-4 border-b">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search or enter name..."
                          value={newContactSearchQuery}
                          onChange={(e) =>
                            setNewContactSearchQuery(e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="divide-y">
                        {filteredAvailableContacts.length > 0 ? (
                          filteredAvailableContacts.map((contact) => (
                            <div
                              key={contact.id}
                              onClick={() => handleSelectNewContact(contact)}
                              className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                  <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    contact.status === "online"
                                      ? "bg-green-500"
                                      : contact.status === "away"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400"
                                  }`}
                                ></span>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {contact.name}
                                </h4>
                                <span className="text-sm text-gray-500 flex items-center">
                                  {contact.status === "online"
                                    ? "Online"
                                    : contact.status === "away"
                                    ? "Away"
                                    : contact.lastSeen
                                    ? `Last seen ${formatMessageDate(
                                        contact.lastSeen
                                      )}`
                                    : "Offline"}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : newContactSearchQuery ? (
                          <div className="p-4 text-center">
                            <p className="text-gray-500 mb-4">
                              No contacts found for "{newContactSearchQuery}"
                            </p>
                            <button
                              onClick={handleCreateCustomContact}
                              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Create new contact
                            </button>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-gray-500">
                            Search for a contact to start chatting
                          </div>
                        )}
                      </div>
                    </div>

                    {newContactSearchQuery && (
                      <div className="p-4 border-t">
                        <button
                          onClick={handleCreateCustomContact}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Start Conversation with "{newContactSearchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Conversation view with optimized message rendering */}
                {activeView === "conversation" && activeContact && (
                  <div className="w-full flex flex-col h-full">
                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      {conversations[activeContact.id] &&
                      conversations[activeContact.id].length > 0 ? (
                        <div className="space-y-4">
                          {conversations[activeContact.id].map(
                            (message, index) => {
                              // Check if we need to add a date separator
                              const showDateSeparator =
                                index === 0 ||
                                new Date(message.timestamp).toDateString() !==
                                  new Date(
                                    conversations[activeContact.id][
                                      index - 1
                                    ].timestamp
                                  ).toDateString();

                              const formattedDate = new Date(
                                message.timestamp
                              ).toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              });

                              return (
                                <ChatMessage
                                  key={message.id}
                                  message={message}
                                  showDateSeparator={showDateSeparator}
                                  formattedDate={formattedDate}
                                  activeContact={activeContact}
                                  formatTime={formatTime}
                                />
                              );
                            }
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-800 mb-1">
                            No messages yet
                          </h3>
                          <p className="text-gray-500 max-w-xs text-center">
                            Send a message to start the conversation with{" "}
                            {activeContact.name}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Chat input */}
                    <div className="p-3 border-t bg-white mt-auto">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                          <Smile className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                          placeholder="Type a message..."
                          className="flex-1 py-2 px-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {messageInput.trim() ? (
                          <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        ) : (
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                            <Mic className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ChatModule);
