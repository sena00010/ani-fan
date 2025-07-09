import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
    X,
    Mail,
    CheckCircle,
    Shield,
    Star,
    Heart,
    Sparkles,
    ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const resetForm = () => {
        setEmail("");
        setError(null);
        setIsLoading(false);
        setIsSuccess(false);
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                resetForm();
            }, 300);
        }
    }, [isOpen]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendResetEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!validateEmail(email)) {
            setError("Lütfen geçerli bir e-posta adresi girin.");
            setIsLoading(false);
            return;
        }

        try {
            // Firebase ile şifre sıfırlama e-postası gönder
            await sendPasswordResetEmail(auth, email);

            setIsSuccess(true);
            toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi! 📧", {
                duration: 4000,
                icon: '✨',
            });

        } catch (error: any) {
            console.error("Şifre sıfırlama hatası:", error);

            let errorMessage = "Şifre sıfırlama e-postası gönderilirken hata oluştu.";

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Geçersiz e-posta adresi.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "İnternet bağlantınızı kontrol edin.";
                    break;
                default:
                    errorMessage = "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
            }

            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 4000,
                icon: '💔',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        onClose();
    };

    // Anime karakteri SVG component'i
    const AnimeCharacter = () => (
        <svg viewBox="0 0 300 400" style={{ width: '100%', height: '100%', maxWidth: '180px' }}>
            {/* Karakter gövdesi */}
            <ellipse cx="150" cy="320" rx="60" ry="40" fill="#8b5cf6" opacity="0.8"/>

            {/* Kafa */}
            <circle cx="150" cy="120" r="45" fill="#fbbf24"/>

            {/* Üzgün ifade için kaşlar */}
            <path d="M125 100 Q135 95 145 100" stroke="#6b7280" strokeWidth="3" fill="none"/>
            <path d="M155 100 Q165 95 175 100" stroke="#6b7280" strokeWidth="3" fill="none"/>

            {/* Saç */}
            <path d="M105 85 Q150 60 195 85 Q200 70 180 65 Q150 50 120 65 Q100 70 105 85" fill="#a855f7"/>
            <path d="M130 70 Q140 50 150 70" fill="#c084fc"/>
            <path d="M150 70 Q160 50 170 70" fill="#c084fc"/>

            {/* Üzgün gözler */}
            <ellipse cx="135" cy="115" rx="8" ry="12" fill="#1f2937"/>
            <ellipse cx="165" cy="115" rx="8" ry="12" fill="#1f2937"/>
            <circle cx="135" cy="113" r="3" fill="white"/>
            <circle cx="165" cy="113" r="3" fill="white"/>

            {/* Gözyaşı */}
            <ellipse cx="130" cy="125" rx="2" ry="8" fill="#60a5fa" opacity="0.8"/>

            {/* Üzgün ağız */}
            <path d="M140 140 Q150 135 160 140" stroke="#ef4444" strokeWidth="2" fill="none"/>

            {/* Vücut */}
            <rect x="120" y="165" width="60" height="80" rx="30" fill="#8b5cf6"/>

            {/* Kollar */}
            <ellipse cx="100" cy="200" rx="15" ry="35" fill="#fbbf24"/>
            <ellipse cx="200" cy="200" rx="15" ry="35" fill="#fbbf24"/>

            {/* Eller */}
            <circle cx="95" cy="230" r="12" fill="#fbbf24"/>
            <circle cx="205" cy="230" r="12" fill="#fbbf24"/>

            {/* Bacaklar */}
            <rect x="130" y="245" width="15" height="60" rx="7" fill="#8b5cf6"/>
            <rect x="155" y="245" width="15" height="60" rx="7" fill="#8b5cf6"/>

            {/* Ayaklar */}
            <ellipse cx="137" cy="310" rx="12" ry="8" fill="#1f2937"/>
            <ellipse cx="162" cy="310" rx="12" ry="8" fill="#1f2937"/>
        </svg>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1000000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8))',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem'
                    }}
                    onClick={onClose}
                >
                    <motion.div
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
                            borderImage: 'linear-gradient(45deg, #a855f7, #ec4899, #8b5cf6, #3b82f6) 1'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left side - Anime themed */}
                        <div
                            style={{
                                display: 'none',
                                width: '50%',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                padding: '2rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            className="md:block"
                        >
                            {/* Floating anime elements */}
                            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                                {/* Yıldızlar ve kalpler */}
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
                                    style={{ position: 'absolute', bottom: '30%', left: '20%', color: '#60a5fa' }}
                                >
                                    <Sparkles size={18} fill="currentColor" />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: -360, y: [-10, 10, -10] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ position: 'absolute', bottom: '20%', right: '10%', color: '#fbbf24' }}
                                >
                                    <Star size={14} fill="currentColor" />
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
                                        {isSuccess ? 'E-posta Gönderildi! 📧' : 'Şifremi Unuttum 😢'}
                                    </h2>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', fontWeight: '500' }}>
                                        {isSuccess
                                            ? 'E-posta kutunuzu kontrol edin! 📬'
                                            : 'Merak etme, herkese olur! 🌸'
                                        }
                                    </p>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                                        {isSuccess
                                            ? 'Şifre sıfırlama bağlantısı gönderildi'
                                            : 'E-posta adresini gir, yardım edelim'
                                        }
                                    </p>
                                </motion.div>

                                {/* Anime karakter */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    style={{
                                        width: '180px',
                                        height: '180px',
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
                                        <span>Güvenli şifre sıfırlama</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem' }}>
                                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                                        <span>Firebase ile korumalı sistem</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                                        <span>Hızlı e-posta gönderimi</span>
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

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h3 style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '0.5rem'
                                }}>
                                    {isSuccess ? 'E-posta Gönderildi! 🎉' : 'Şifremi Unuttum 🤔'}
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                                    {isSuccess
                                        ? 'E-posta kutunuzu kontrol edin ve bağlantıya tıklayın'
                                        : 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim'
                                    }
                                </p>
                            </div>

                            {!isSuccess ? (
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSendResetEmail}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    {error && (
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
                                            💔 {error}
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
                                                    paddingTop: '1rem',
                                                    paddingBottom: '1rem',
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
                                                : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            border: 'none',
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            boxShadow: isLoading
                                                ? '0 4px 15px rgba(156, 163, 175, 0.4)'
                                                : '0 4px 15px rgba(139, 92, 246, 0.4)',
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
                                                E-posta gönderiliyor...
                                            </span>
                                        ) : (
                                            '🚀 Şifre Sıfırlama Bağlantısı Gönder'
                                        )}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleBackToLogin}
                                        disabled={isLoading}
                                        style={{
                                            width: '100%',
                                            paddingTop: '0.75rem',
                                            paddingBottom: '0.75rem',
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '2px solid #e5e7eb',
                                            color: '#6b7280',
                                            fontWeight: '500',
                                            fontSize: '0.95rem',
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            opacity: isLoading ? 0.5 : 1
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isLoading) {
                                                e.currentTarget.style.background = 'white';
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                                e.currentTarget.style.color = '#374151';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isLoading) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                                e.currentTarget.style.color = '#6b7280';
                                            }
                                        }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Giriş Sayfasına Dön
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ textAlign: 'center' }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem auto',
                                            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
                                        }}
                                    >
                                        <Mail className="w-8 h-8" style={{ color: 'white' }} />
                                    </motion.div>

                                    <p style={{
                                        color: '#6b7280',
                                        fontSize: '1rem',
                                        marginBottom: '2rem',
                                        lineHeight: '1.6'
                                    }}>
                                        <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi.
                                        <br />E-posta kutunuzu kontrol edin ve bağlantıya tıklayın.
                                    </p>

                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                        border: '2px solid #bae6fd',
                                        borderRadius: '12px',
                                        marginBottom: '2rem'
                                    }}>
                                        <p style={{ color: '#0369a1', fontSize: '0.875rem', margin: 0 }}>
                                            💡 <strong>İpucu:</strong> E-posta gelmezse spam klasörünüzü kontrol edin!
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBackToLogin}
                                        style={{
                                            width: '100%',
                                            paddingTop: '1rem',
                                            paddingBottom: '1rem',
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Giriş Sayfasına Dön
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;