"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Cookies from "js-cookie";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                Cookies.set('user_uid', user.uid, {
                    expires: 7, // 7 gün
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
                console.log("Kullanıcı giriş yaptıysa UID'yi cookie'ye kaydet");

                // Email'i de kaydedebilirsin
                if (user.email) {
                    Cookies.set('user_email', user.email, {
                        expires: 7,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax'
                    });
                }

                setUser(user);
            } else {
                // Kullanıcı çıkış yaptıysa cookie'leri temizle
                Cookies.remove('user_uid');
                Cookies.remove('user_email');
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
            // Cookie'ler otomatik olarak onAuthStateChanged içinde temizlenecek
        } catch (error) {
            console.error('Çıkış yapılırken hata:', error);
        }
    };

    const value = {
        user,
        loading,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};