"use client";
import UserProfile from "@/components/userProfileComp/UserProfile";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {auth} from "@/lib/firebase";

interface UserProfileClientProps {
    initialData: any;
    currentUserId?: string;
}

const UserProfileClient: React.FC<UserProfileClientProps> = ({
                                                                 initialData,
                                                                 currentUserId
                                                             }) => {
    const [user, setUser] = useState<any | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    console.log(initialData,"initialDatainitialDatainitialData")
    console.log(user,"user111111");
    if (!user || !initialData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">😔</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Bulunamadı</h2>
                    <p className="text-gray-600 mb-4">Profil bilgileriniz yüklenemedi.</p>
                    <a
                        href="/"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Ana Sayfaya Dön
                    </a>
                </div>
            </div>
        );
    }

    return (
        <UserProfile
            initialData={initialData}
            currentUser={user}
        />
    );
};

export default UserProfileClient;