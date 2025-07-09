import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  UserPlus,
  LogIn,
  Star,
  Heart,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ForgotPasswordModal from "@/components/layouts/ForgotPasswordModal";
import { createPortal } from "react-dom";
import {validateEmail, validatePassword} from "@/lib/helper";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import userService from "@/services/userService";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {nice} from "d3-array";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickName, setNickName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setSurname("");
    setConfirmPassword("");
    setLoginError(null);
    setRegisterError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        resetForm();
        setActiveTab("login");
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    // Email ve şifre validation
    if (!email || !password) {
      setLoginError("E-posta ve şifre gereklidir.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setLoginError("Geçerli bir e-posta adresi girin.");
      setIsLoading(false);
      return;
    }

    try {
      // Firebase ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Başarılı giriş:", user);

      // Başarılı giriş toast'ı
      toast.success(`Hoş geldin! 🎉`, {
        duration: 3000,
        icon: '✨',
      });

      // Modal'ı kapat
      onClose();

      // Form'u temizle
      resetForm();
      await user.getIdToken().then(async (token) => {
        await fetch("/api/set-auth-cookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ uid: user.uid, token })
        });
      });
    } catch (error: any) {
      console.error("Giriş hatası:", error);

      // Firebase error kodlarına göre Türkçe mesajlar
      let errorMessage = "Giriş yapılırken bir hata oluştu.";

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Hatalı şifre girdiniz.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Geçersiz e-posta adresi.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Bu hesap devre dışı bırakılmış.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "İnternet bağlantınızı kontrol edin.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "E-posta veya şifre hatalı.";
          break;
        default:
          errorMessage = "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
      }

      setLoginError(errorMessage);

      // Error toast
      toast.error(errorMessage, {
        duration: 4000,
        icon: '💔',
      });
    } finally {
      setIsLoading(false);
    }

  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const provider = new GoogleAuthProvider();
      // Google popup için ek ayarlar
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google ile başarılı giriş:", user);

      toast.success(`Google ile hoş geldin! 🚀`, {
        duration: 3000,
        icon: '✨',
      });

      onClose();
      resetForm();

    } catch (error: any) {
      console.error("Google giriş hatası:", error);

      let errorMessage = "Google ile giriş yapılırken hata oluştu.";

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Giriş işlemi iptal edildi.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Popup engellenmiş. Lütfen popup'ları etkinleştirin.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "İnternet bağlantınızı kontrol edin.";
          break;
        default:
          errorMessage = "Google ile giriş yapılırken beklenmeyen bir hata oluştu.";
      }

      setLoginError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        icon: '💔',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError(null);

    if (!name || !surname || !email || !password || !confirmPassword) {
      setRegisterError("Lütfen tüm alanları doldurun.");
      setIsLoading(false);
      return;
    }

    if (name.trim().length < 2) {
      setRegisterError("İsim en az 2 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }

    if (surname.trim().length < 2) {
      setRegisterError("Soyisim en az 2 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setRegisterError("Geçerli bir e-posta adresi girin.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setRegisterError("Şifre en az 6 karakter olmalı ve boşluk içermemelidir.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Şifreler eşleşmiyor.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore kaydı
      await setDoc(doc(db, "user", user.uid), {
        uid: user.uid,
        name: name.trim(),
        surname: surname.trim(),
        nickname:nickName,
        type: "user",
        email: email,
        createdAt: new Date().toISOString()
      });

      // Backend'e kaydet
      const userData = {
        email,
        name: name.trim(),
        surname: surname.trim(),
        nickname:nickName.trim(),
        password,
        uid: user.uid,
      };

      const backendResponse = await userService.registerUser(userData);
      console.log("Backend'e kayıt:", backendResponse);

      toast.success(`Hoş geldin ${name}! 🎉`, {
        duration: 3000,
        icon: '✨',
      });

      onClose();
      resetForm();

    } catch (error: any) {
      console.error("Register hatası:", error);
      let errorMessage = "Kayıt olurken bir hata oluştu.";

      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Bu e-posta adresi zaten kullanımda.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Geçersiz e-posta adresi.";
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "E-posta/şifre ile kayıt şu anda devre dışı.";
            break;
          case 'auth/weak-password':
            errorMessage = "Şifre çok zayıf. En az 6 karakter olmalıdır.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "İnternet bağlantınızı kontrol edin.";
            break;
          default:
            errorMessage = "Firebase kayıt hatası: " + error.message;
        }
      } else {
        if (error.message.includes('bu email adresi zaten kayıtlı')) {
          errorMessage = "Bu e-posta adresi zaten kullanımda.";
        } else {
          errorMessage = error.message || "Backend kayıt hatası oluştu.";
        }
      }

      setRegisterError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        icon: '💔',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotModal(true);
  };

  // Anime karakteri SVG component'i
  const AnimeCharacter = () => (
      <svg viewBox="0 0 300 400" style={{ width: '100%', height: '100%', maxWidth: '200px' }}>
        {/* Karakter gövdesi */}
        <ellipse cx="150" cy="320" rx="60" ry="40" fill="#6366f1" opacity="0.8"/>

        {/* Kafa */}
        <circle cx="150" cy="120" r="45" fill="#fbbf24"/>

        {/* Saç */}
        <path d="M105 85 Q150 60 195 85 Q200 70 180 65 Q150 50 120 65 Q100 70 105 85" fill="#8b5cf6"/>
        <path d="M130 70 Q140 50 150 70" fill="#a855f7"/>
        <path d="M150 70 Q160 50 170 70" fill="#a855f7"/>

        {/* Gözler */}
        <ellipse cx="135" cy="115" rx="8" ry="12" fill="#1f2937"/>
        <ellipse cx="165" cy="115" rx="8" ry="12" fill="#1f2937"/>
        <circle cx="135" cy="113" r="3" fill="white"/>
        <circle cx="165" cy="113" r="3" fill="white"/>

        {/* Ağız */}
        <path d="M140 135 Q150 140 160 135" stroke="#ef4444" strokeWidth="2" fill="none"/>

        {/* Vücut */}
        <rect x="120" y="165" width="60" height="80" rx="30" fill="#3b82f6"/>

        {/* Kollar */}
        <ellipse cx="100" cy="200" rx="15" ry="35" fill="#fbbf24"/>
        <ellipse cx="200" cy="200" rx="15" ry="35" fill="#fbbf24"/>

        {/* Eller */}
        <circle cx="95" cy="230" r="12" fill="#fbbf24"/>
        <circle cx="205" cy="230" r="12" fill="#fbbf24"/>

        {/* Bacaklar */}
        <rect x="130" y="245" width="15" height="60" rx="7" fill="#6366f1"/>
        <rect x="155" y="245" width="15" height="60" rx="7" fill="#6366f1"/>

        {/* Ayaklar */}
        <ellipse cx="137" cy="310" rx="12" ry="8" fill="#1f2937"/>
        <ellipse cx="162" cy="310" rx="12" ry="8" fill="#1f2937"/>

        {/* Yıldızlar */}
        <g fill="#fbbf24">
          <path d="M80 50 L82 56 L88 56 L83 60 L85 66 L80 62 L75 66 L77 60 L72 56 L78 56 Z"/>
          <path d="M220 80 L222 86 L228 86 L223 90 L225 96 L220 92 L215 96 L217 90 L212 86 L218 86 Z"/>
          <path d="M90 300 L92 306 L98 306 L93 310 L95 316 L90 312 L85 316 L87 310 L82 306 L88 306 Z"/>
        </g>
      </svg>
  );

  // Modal content'ini render et
  const modalContent = (

      <AnimatePresence>
        {isOpen && (
            <motion.div
                key="auth-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999999,
                  display: showForgotModal ? "none" : "flex",
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8))',
                  backdropFilter: 'blur(10px)',
                  padding: '1rem'
                }}
                onClick={onClose}
            >
              <motion.div
                  key="auth-modal"
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    position: 'relative',
                    border: '3px solid',
                    borderImage: 'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6) 1'
                  }}
                  onClick={(e) => e.stopPropagation()}
              >
                {/* Left side - Anime themed */}
                <div
                    style={{
                      display: 'none',
                      width: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '2rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="md:block"
                >
                  {/* Floating anime elements */}
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {/* Yıldızlar */}
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'absolute', top: '10%', left: '10%', color: '#fbbf24' }}
                    >
                      <Star size={16} fill="currentColor" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'absolute', top: '20%', right: '15%', color: '#ec4899' }}
                    >
                      <Heart size={20} fill="currentColor" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'absolute', bottom: '30%', left: '20%', color: '#a855f7' }}
                    >
                      <Sparkles size={18} fill="currentColor" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: -360, y: [-10, 10, -10] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: 'absolute', bottom: '20%', right: '10%', color: '#3b82f6' }}
                    >
                      <Star size={14} fill="currentColor" />
                    </motion.div>

                    {/* Kawaii bulutlar */}
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          position: 'absolute',
                          top: '15%',
                          right: '5%',
                          width: '40px',
                          height: '25px',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          borderRadius: '20px',
                        }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '8px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '8px',
                        width: '15px',
                        height: '15px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%'
                      }}></div>
                    </motion.div>
                  </div>

                  <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: '2rem' }}
                    >
                      <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        AnimeConnect ✨
                      </h2>
                      <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', fontWeight: '500' }}>
                        Anime dünyasının kapılarını aralay! 🌸
                      </p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        İncelemeler, topluluk ve rehberlik için tek adresin
                      </p>
                    </motion.div>

                    {/* Anime karakter */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        style={{
                          width: '200px',
                          height: '200px',
                          marginBottom: '2rem',
                          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                        }}
                    >
                      <AnimeCharacter />
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{ textAlign: 'center' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem' }}>
                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                        <span>Güvenli giriş ve kayıt</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem' }}>
                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                        <span>Kişisel anime önerilerine erişim</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                        <span>Favori animelerini takip et</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right side with form */}
                <div style={{ width: '100%', padding: '2rem', position: 'relative', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                  <button
                      onClick={onClose}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '1rem',
                        padding: '0.5rem',
                        color: '#64748b',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#334155';
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Tabs */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => {
                          setActiveTab("login");
                          resetForm();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          border: 'none',
                          background: activeTab === "login"
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '50px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          color: activeTab === "login" ? 'white' : '#64748b',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          boxShadow: activeTab === "login"
                              ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                              : '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Giriş Yap</span>
                    </button>

                    <button
                        onClick={() => {
                          setActiveTab("register");
                          resetForm();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          border: 'none',
                          background: activeTab === "register"
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '50px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          color: activeTab === "register" ? 'white' : '#64748b',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          boxShadow: activeTab === "register"
                              ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                              : '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Üye Ol</span>
                    </button>
                  </div>

                  {/* Login Form */}
                  {activeTab === "login" && (
                      <motion.form
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={handleLogin}
                          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                      >
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                  padding: '1rem',
                                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                  border: '2px solid #fecaca',
                                  borderRadius: '12px',
                                  color: '#dc2626',
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
                                }}
                            >
                              💔 {loginError}
                            </motion.div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label htmlFor="email" style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginLeft: '0.5rem'
                          }}>
                            📧 E-posta Adresi
                          </label>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              paddingLeft: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              pointerEvents: 'none'
                            }}>
                              <Mail className="h-5 w-5" style={{ color: '#9ca3af' }} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  paddingLeft: '3rem',
                                  paddingRight: '1rem',
                                  paddingTop: '0.875rem',
                                  paddingBottom: '0.875rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '16px',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: 'all 0.2s',
                                  background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  opacity: isLoading ? 0.7 : 1
                                }}
                                placeholder="anime@ornek.com"
                                required
                                onFocus={(e) => {
                                  if (!isLoading) {
                                    e.target.style.borderColor = '#8b5cf6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    e.target.style.background = 'white';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e5e7eb';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                  e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label htmlFor="password" style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginLeft: '0.5rem'
                            }}>
                              🔒 Şifre
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPasswordClick}
                                disabled={isLoading}
                                style={{
                                  fontSize: '0.75rem',
                                  color: isLoading ? '#9ca3af' : '#8b5cf6',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: isLoading ? 'not-allowed' : 'pointer',
                                  transition: 'color 0.2s',
                                  fontWeight: '500'
                                }}
                                onMouseOver={(e) => {
                                  if (!isLoading) e.currentTarget.style.color = '#7c3aed';
                                }}
                                onMouseOut={(e) => {
                                  if (!isLoading) e.currentTarget.style.color = '#8b5cf6';
                                }}
                            >
                              Şifremi unuttum? 🤔
                            </button>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              paddingLeft: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              pointerEvents: 'none'
                            }}>
                              <Lock className="h-5 w-5" style={{ color: '#9ca3af' }} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  paddingLeft: '3rem',
                                  paddingRight: '3rem',
                                  paddingTop: '0.875rem',
                                  paddingBottom: '0.875rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '16px',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: 'all 0.2s',
                                  background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  opacity: isLoading ? 0.7 : 1
                                }}
                                placeholder="••••••••"
                                required
                                onFocus={(e) => {
                                  if (!isLoading) {
                                    e.target.style.borderColor = '#8b5cf6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    e.target.style.background = 'white';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e5e7eb';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                  e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  paddingRight: '1rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: isLoading ? 'not-allowed' : 'pointer',
                                  transition: 'color 0.2s'
                                }}
                            >
                              {showPassword ? (
                                  <EyeOff className="h-5 w-5" style={{ color: '#9ca3af' }} />
                              ) : (
                                  <Eye className="h-5 w-5" style={{ color: '#9ca3af' }} />
                              )}
                            </button>
                          </div>
                        </div>

                        <motion.button
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={isLoading}
                            style={{
                              width: '100%',
                              paddingTop: '1rem',
                              paddingBottom: '1rem',
                              borderRadius: '16px',
                              background: isLoading
                                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '1rem',
                              border: 'none',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              boxShadow: isLoading
                                  ? '0 4px 15px rgba(156, 163, 175, 0.4)'
                                  : '0 4px 15px rgba(102, 126, 234, 0.4)',
                              transition: 'all 0.2s',
                              opacity: isLoading ? 0.7 : 1
                            }}
                        >
                          {isLoading ? (
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      border: '2px solid white',
                                      borderTop: '2px solid transparent',
                                      borderRadius: '50%'
                                    }}
                                />
                                Giriş yapılıyor...
                              </span>
                          ) : (
                              '✨ Anime Dünyasına Gir'
                          )}
                        </motion.button>

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                          <div style={{ flex: 1, borderTop: '2px solid #e5e7eb' }}></div>
                          <span style={{ margin: '0 1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>veya</span>
                          <div style={{ flex: 1, borderTop: '2px solid #e5e7eb' }}></div>
                        </div>

                        <motion.button
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            type="button"
                            onClick={handleGoogleAuth}
                            disabled={isLoading}
                            style={{
                              width: '100%',
                              backgroundColor: isLoading ? '#f3f4f6' : 'white',
                              border: '2px solid #e5e7eb',
                              paddingTop: '0.875rem',
                              paddingBottom: '0.875rem',
                              borderRadius: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.75rem',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              fontWeight: '500',
                              opacity: isLoading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                              }
                            }}
                        >
                          {isLoading ? (
                              <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #d1d5db',
                                    borderTop: '2px solid #6b7280',
                                    borderRadius: '50%'
                                  }}
                              />
                          ) : (
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 48 48"
                              >
                                <path
                                    fill="#FFC107"
                                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                              </svg>
                          )}
                          {isLoading ? 'Bağlanıyor...' : 'Google ile Devam Et 🚀'}
                        </motion.button>
                      </motion.form>
                  )}

                  {/* Register Form */}
                  {activeTab === "register" && (
                      <motion.form
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={handleRegister}
                          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                      >
                        {registerError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                  padding: '1rem',
                                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                  border: '2px solid #fecaca',
                                  borderRadius: '12px',
                                  color: '#dc2626',
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
                                }}
                            >
                              💔 {registerError}
                            </motion.div>
                        )}

                        {/* İsim ve Soyisim */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="name" style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginLeft: '0.5rem'
                            }}>
                              👤 İsim
                            </label>
                            <div style={{ position: 'relative' }}>
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                paddingLeft: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                pointerEvents: 'none'
                              }}>
                                <User className="h-5 w-5" style={{ color: '#9ca3af' }} />
                              </div>
                              <input
                                  id="name"
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  disabled={isLoading}
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    paddingTop: '0.875rem',
                                    paddingBottom: '0.875rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '16px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    opacity: isLoading ? 0.7 : 1
                                  }}
                                  placeholder="Name"
                                  required
                                  onFocus={(e) => {
                                    if (!isLoading) {
                                      e.target.style.borderColor = '#8b5cf6';
                                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                      e.target.style.background = 'white';
                                    }
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                    e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                  }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="surname" style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginLeft: '0.5rem'
                            }}>
                              👥 Soyisim
                            </label>
                            <div style={{ position: 'relative' }}>
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                paddingLeft: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                pointerEvents: 'none'
                              }}>
                                <User className="h-5 w-5" style={{ color: '#9ca3af' }} />
                              </div>
                              <input
                                  id="surname"
                                  type="text"
                                  value={surname}
                                  onChange={(e) => setSurname(e.target.value)}
                                  disabled={isLoading}
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    paddingTop: '0.875rem',
                                    paddingBottom: '0.875rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '16px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    opacity: isLoading ? 0.7 : 1
                                  }}
                                  placeholder="Surname"
                                  required
                                  onFocus={(e) => {
                                    if (!isLoading) {
                                      e.target.style.borderColor = '#8b5cf6';
                                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                      e.target.style.background = 'white';
                                    }
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                    e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                  }}
                              />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label htmlFor="register-nickname" style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginLeft: '0.5rem'
                          }}>
                            📧 Nick Name
                          </label>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              paddingLeft: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              pointerEvents: 'none'
                            }}>
                              <Mail className="h-5 w-5" style={{ color: '#9ca3af' }} />
                            </div>
                            <input
                                id="register-nickname"
                                type="nickname"
                                value={nickName}
                                onChange={(e) => setNickName(e.target.value)}
                                disabled={isLoading}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  paddingLeft: '3rem',
                                  paddingRight: '1rem',
                                  paddingTop: '0.875rem',
                                  paddingBottom: '0.875rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '16px',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: 'all 0.2s',
                                  background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  opacity: isLoading ? 0.7 : 1
                                }}
                                placeholder="anime@ornek.com"
                                required
                                onFocus={(e) => {
                                  if (!isLoading) {
                                    e.target.style.borderColor = '#8b5cf6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    e.target.style.background = 'white';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e5e7eb';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                  e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                }}
                            />
                          </div>
                        </div>

                        {/* E-posta */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label htmlFor="register-email" style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginLeft: '0.5rem'
                          }}>
                            📧 E-posta Adresi
                          </label>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              paddingLeft: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              pointerEvents: 'none'
                            }}>
                              <Mail className="h-5 w-5" style={{ color: '#9ca3af' }} />
                            </div>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  paddingLeft: '3rem',
                                  paddingRight: '1rem',
                                  paddingTop: '0.875rem',
                                  paddingBottom: '0.875rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '16px',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: 'all 0.2s',
                                  background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  opacity: isLoading ? 0.7 : 1
                                }}
                                placeholder="anime@ornek.com"
                                required
                                onFocus={(e) => {
                                  if (!isLoading) {
                                    e.target.style.borderColor = '#8b5cf6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    e.target.style.background = 'white';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e5e7eb';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                  e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                }}
                            />
                          </div>
                        </div>

                        {/* Şifre */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label htmlFor="register-password" style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginLeft: '0.5rem'
                          }}>
                            🔒 Şifre
                          </label>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              paddingLeft: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              pointerEvents: 'none'
                            }}>
                              <Lock className="h-5 w-5" style={{ color: '#9ca3af' }} />
                            </div>
                            <input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  paddingLeft: '3rem',
                                  paddingRight: '3rem',
                                  paddingTop: '0.875rem',
                                  paddingBottom: '0.875rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '16px',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: 'all 0.2s',
                                  background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  opacity: isLoading ? 0.7 : 1
                                }}
                                placeholder="••••••••"
                                required
                                onFocus={(e) => {
                                  if (!isLoading) {
                                    e.target.style.borderColor = '#8b5cf6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    e.target.style.background = 'white';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e5e7eb';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                  e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  bottom: 0,
                                  paddingRight: '1rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: isLoading ? 'not-allowed' : 'pointer',
                                  transition: 'color 0.2s'
                                }}
                            >
                              {showPassword ? (
                                  <EyeOff className="h-5 w-5" style={{ color: '#9ca3af' }} />
                              ) : (
                                  <Eye className="h-5 w-5" style={{ color: '#9ca3af' }} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Şifre Tekrar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label htmlFor="confirm-password" style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginLeft: '0.5rem'
                          }}>
                            🔐 Şifre Tekrar
                          </label>
                          <div style={{ position: 'relative' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              paddingLeft: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              pointerEvents: 'none'
                            }}>
                              <Lock className="h-5 w-5" style={{ color: '#9ca3af' }} />
                            </div>
                            <input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  paddingLeft: '3rem',
                                  paddingRight: '1rem',
                                  paddingTop: '0.875rem',
                                  paddingBottom: '0.875rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '16px',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: 'all 0.2s',
                                  background: isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  opacity: isLoading ? 0.7 : 1
                                }}
                                placeholder="••••••••"
                                required
                                onFocus={(e) => {
                                  if (!isLoading) {
                                    e.target.style.borderColor = '#8b5cf6';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                    e.target.style.background = 'white';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e5e7eb';
                                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                  e.target.style.background = isLoading ? 'rgba(249, 250, 251, 0.5)' : 'rgba(255, 255, 255, 0.9)';
                                }}
                            />
                          </div>
                        </div>

                        <motion.button
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={isLoading}
                            style={{
                              width: '100%',
                              paddingTop: '1rem',
                              paddingBottom: '1rem',
                              borderRadius: '16px',
                              background: isLoading
                                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '1rem',
                              border: 'none',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              boxShadow: isLoading
                                  ? '0 4px 15px rgba(156, 163, 175, 0.4)'
                                  : '0 4px 15px rgba(16, 185, 129, 0.4)',
                              transition: 'all 0.2s',
                              opacity: isLoading ? 0.7 : 1
                            }}
                        >
                          {isLoading ? (
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{
                                      width: '16px',
                                      height: '16px',
                                      border: '2px solid white',
                                      borderTop: '2px solid transparent',
                                      borderRadius: '50%'
                                    }}
                                />
                                Kayıt yapılıyor...
                              </span>
                          ) : (
                              '🌸 Anime Topluluğuna Katıl'
                          )}
                        </motion.button>
                      </motion.form>
                  )}
                </div>
              </motion.div>
            </motion.div>
        )}
        <ForgotPasswordModal
            key="forgot-modal"
            isOpen={showForgotModal}
            onClose={() => setShowForgotModal(false)}
        />
      </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default AuthModal;