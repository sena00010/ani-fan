"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
        console.log("AuthProvider: useEffect çalıştı");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("AuthProvider: onAuthStateChanged callback çalıştı", firebaseUser);
            
            if (firebaseUser) {
                console.log("AuthProvider: Firebase user bulundu", firebaseUser.uid, firebaseUser.email);
                try {
                    // Firestore'dan kullanıcı verisini çek
                    const userRef = doc(db, "user", firebaseUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        console.log("AuthProvider: Firestore user data bulundu", userData);
                        // Firebase User objesini Firestore verisiyle birleştir
                        const enhancedUser = {
                            ...firebaseUser,
                            displayName: userData.displayName || userData.name || firebaseUser.displayName,
                            photoURL: userData.photoURL || userData.avatar || firebaseUser.photoURL,
                            // Firestore'dan gelen diğer verileri de ekle
                            ...userData,
                        } as User;
                        console.log("AuthProvider: Enhanced user set ediliyor", enhancedUser);
                        setUser(enhancedUser);
                    } else {
                        // Firestore'da kullanıcı bulunamadıysa sadece Firebase User'ı kullan
                        console.log("AuthProvider: Firestore'da kullanıcı bulunamadı, sadece Firebase User kullanılıyor");
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("AuthProvider: Firestore kullanıcı verisi alma hatası:", error);
                    // Hata durumunda sadece Firebase User'ı kullan
                    setUser(firebaseUser);
                }
            } else {
                console.log("AuthProvider: Firebase user null");
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            console.log("AuthProvider: unsubscribe");
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
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