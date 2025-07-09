import {getServerUser, preloadUserProfileInformation} from "@/lib/server/preloadData";
import UserProfileClient from "@/components/userProfileComp/UserProfileClient";


export default async function Profile() {
    const serverUser = getServerUser();
    if (!serverUser.isAuthenticated || !serverUser.uid) {
    }
    console.log(serverUser,"serverUser")
    const userInformation = await preloadUserProfileInformation(serverUser.uid);
    console.log(serverUser,"serverUser")
    console.log(serverUser.uid,"serverUser.uid")
    console.log(userInformation,"userInformation")
    if (!userInformation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">😔</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Yüklenemedi</h2>
                    <p className="text-gray-600 mb-4">Profil bilgileriniz getirilemedi.</p>
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
        <UserProfileClient
            initialData={userInformation}
        />
    );
}