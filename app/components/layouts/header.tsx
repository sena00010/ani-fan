"use client"
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Star,
  Heart,
  Sparkles,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  Home,
  Bell,
  Palette,
  Wand2,
  Crown,
  Zap
} from 'lucide-react';
import AuthModal from "@/components/modals/AuthModal";
import { onAuthStateChanged } from "firebase/auth";
import {auth, db} from "@/lib/firebase";
import {doc, getDoc} from "firebase/firestore";
import { signOut } from "firebase/auth";

const AnimeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  console.log("header yüklendi")
  // İki ayrı state: biri authentication durumu, diğeri modal kontrolü
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "user", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser(userData);
            setIsAuthenticated(true);
            setShowAuthModal(false);
          } else {
            console.log("Kullanıcı Firestore'da bulunamadı.");
          }
        } catch (error) {
          console.error("Firestore kullanıcı verisi alma hatası:", error);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  console.log(user,"useruser")
  const menuItems = [
    {
      name: "Ana Sayfa",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      name: "Anime",
      href: "/anime",
      icon: <Star className="w-4 h-4" />,
      hasMegaMenu: true,
      megaMenuId: "anime"
    },
    {
      name: "Manga",
      href: "/manga",
      icon: <BookOpen className="w-4 h-4" />,
      hasMegaMenu: true,
      megaMenuId: "manga"
    },
    {
      name: "Tavsiyeler",
      href: "/recommendations",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      name: "Karakter Oluştur",
      href: "/character-creator",
      icon: <Palette className="w-4 h-4" />,
      isSpecial: true
    },
    {
      name: "Topluluk",
      href: "/community",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Haberler",
      href: "/news",
      icon: <Zap className="w-4 h-4" />,
    }
  ];
  console.log("userfirebase",user)
  const handleMenuMouseEnter = (menuId: string) => {
    setActiveMenu(menuId);
  };

  const handleMenuMouseLeave = () => {
    setTimeout(() => setActiveMenu(null), 300);
  };

  // Modal açma fonksiyonu
  const openAuthModal = () => {
    setShowAuthModal(true);
    setIsUserDropdownOpen(false);
  };

  // Modal kapama fonksiyonu
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      setIsUserDropdownOpen(false);
      console.log("Çıkış başarılı.");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <header className="relative bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-900 backdrop-blur-lg border-b border-white/10 z-[9999]">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-10 text-pink-300 opacity-30 animate-float">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
            </svg>
          </div>
          <div className="absolute top-4 right-20 text-cyan-300 opacity-25 animate-float-reverse" style={{animationDelay: '1s'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11 4 8 4 8 8C8 12 11 14 12 16C13 14 16 12 16 8C16 4 13 4 12 2Z"/>
            </svg>
          </div>
          <div className="absolute top-3 left-1/3 text-purple-300 opacity-20 animate-float" style={{animationDelay: '2s'}}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-50">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-white/10 text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  AnimeConnect
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                if (item.hasMegaMenu) {
                  return (
                      <div
                          key={item.name}
                          className="relative"
                          onMouseEnter={() => handleMenuMouseEnter(item.megaMenuId!)}
                          onMouseLeave={handleMenuMouseLeave}
                      >
                        <button
                            className={`flex items-center px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 ${
                                activeMenu === item.megaMenuId ? "bg-white/10 text-white" : ""
                            }`}
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.name}
                          <ChevronDown
                              className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                  activeMenu === item.megaMenuId ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {/* Mega Menu */}
                        <AnimatePresence>
                          {activeMenu === item.megaMenuId && (
                              <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 z-[9999]"
                              >
                                {item.megaMenuId === "anime" && (
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                          Popüler Kategoriler
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                          <a href="/anime/action" className="text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">🥊 Aksiyon</a>
                                          <a href="/anime/romance" className="text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">💕 Romantik</a>
                                          <a href="/anime/fantasy" className="text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">🔮 Fantezi</a>
                                          <a href="/anime/slice-of-life" className="text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">🌸 Slice of Life</a>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                          <Crown className="w-4 h-4 mr-2 text-purple-500" />
                                          En İyiler
                                        </h3>
                                        <div className="space-y-1">
                                          <a href="/anime/top-rated" className="block text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">En Yüksek Puanlı</a>
                                          <a href="/anime/most-popular" className="block text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">En Popüler</a>
                                          <a href="/anime/trending" className="block text-sm text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors">Trend Olanlar</a>
                                        </div>
                                      </div>
                                    </div>
                                )}

                                {item.megaMenuId === "manga" && (
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                          <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                                          Manga Türleri
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                          <a href="/manga/shonen" className="text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">⚡ Shōnen</a>
                                          <a href="/manga/shoujo" className="text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">🌺 Shōjo</a>
                                          <a href="/manga/seinen" className="text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">🗡️ Seinen</a>
                                          <a href="/manga/josei" className="text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">💼 Josei</a>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                          <Zap className="w-4 h-4 mr-2 text-orange-500" />
                                          Güncel
                                        </h3>
                                        <div className="space-y-1">
                                          <a href="/manga/new-releases" className="block text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">Yeni Çıkanlar</a>
                                          <a href="/manga/ongoing" className="block text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">Devam Edenler</a>
                                          <a href="/manga/completed" className="block text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">Tamamlananlar</a>
                                        </div>
                                      </div>
                                    </div>
                                )}
                              </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                  );
                } else if (item.isSpecial) {
                  return (
                      <div key={item.name} className="relative group">
                        <a
                            href={item.href}
                            className="flex items-center px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="mr-2 relative z-10">{item.icon}</span>
                          <span className="relative z-10">{item.name}</span>
                          <div className="absolute -top-2 -right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                        </a>
                      </div>
                  );
                } else {
                  return (
                      <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-medium transition-all duration-200"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                      </a>
                  );
                }
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Notification - sadece authenticated kullanıcılar için */}
              {isAuthenticated && (
                  <button className="p-2 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>
                  </button>
              )}

              {/* User Menu */}
              <div className="relative" ref={userDropdownRef}>
                <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center p-2 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                          isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                      <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden z-[9999]"
                      >
                        {isAuthenticated ? (
                            <div className="py-2">
                              <div className="px-4 py-3 border-b border-gray-200/50">
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                              <a href="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors">
                                <User className="w-4 h-4 mr-3" />
                                Profilim
                              </a>
                              <a href="/my-anime-list" className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors">
                                <Star className="w-4 h-4 mr-3" />
                                Anime Listem
                              </a>
                              <a href="/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors">
                                <Settings className="w-4 h-4 mr-3" />
                                Ayarlar
                              </a>
                              <button
                                  onClick={handleLogout}
                                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200/50"
                              >
                                <LogOut className="w-4 h-4 mr-3" />
                                Çıkış Yap
                              </button>
                            </div>
                        ) : (
                            <div className="py-2">
                              <button
                                  onClick={openAuthModal}
                                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                              >
                                <User className="w-4 h-4 mr-3" />
                                Giriş Yap
                              </button>
                              <button
                                  onClick={openAuthModal}
                                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                              >
                                <Sparkles className="w-4 h-4 mr-3" />
                                Üye Ol
                              </button>
                            </div>
                        )}
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
              <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-slate-900 to-indigo-900 z-[9999] md:hidden"
                >
                  <div className="p-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-white">AnimeConnect</h1>
                      </div>
                      <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 p-4">
                    {menuItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors mb-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                          {item.isSpecial && (
                              <div className="ml-auto w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </a>
                    ))}
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-10px) rotate(3deg); }
          }

          @keyframes float-reverse {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-8px) rotate(-3deg); }
          }

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
        `}</style>
        <AuthModal
            isOpen={showAuthModal}
            onClose={closeAuthModal}
        />
      </header>
  );
};

export default AnimeHeader;