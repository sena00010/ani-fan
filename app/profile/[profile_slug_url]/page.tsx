import UserProfileClient from "@/components/userProfileComp/UserProfileClient";
import {
    preloadAuthUserProfile,
    preloadCommunityList,
    preloadCommunityPostList,
    preloadUserFollowedList,
    preloadUserFollowerList,
    preloadUserProfileBySlug,
    preloadUserReviewPagination,
} from "@/lib/server/preloadData";
import { redirect } from "next/navigation";

interface Props {
    params: {
        profile_slug_url: string;
    };
}

export default async function ProfileDetailPage({ params }: Props) {
    const { profile_slug_url } = params;

    // SSR'da login olan kullanıcıyı çek
    const loginUser = await preloadAuthUserProfile();
    const profileData = await preloadUserProfileBySlug(profile_slug_url);
    // Eğer kendi profiliniz ise /profile'a SEO uyumlu redirect
    if (loginUser?.user_id && loginUser.user_id === profileData?.user_id) {
        redirect("/profile");
    }

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Profile data could not be loaded</p>
                </div>
            </div>
        );
    }

    const [
        userCommunityList,
        communityPostsData,
        userReviewData,
        userFollowerData,
        userFollowedData,
    ] = await Promise.all([
        preloadCommunityList(),
        profileData.user_id
            ? preloadCommunityPostList({
                community_id: 0,
                user_id: profileData.user_id,
                hashtag_name: "",
                post_id: 0,
                limit: 10,
                offset: 0,
            })
            : { data: [], totalCount: 0 },
        profileData.user_id
            ? preloadUserReviewPagination({
                user_id: profileData.user_id,
                type: "all",
                limit: 10,
                offset: 0,
            })
            : [],
        profileData.user_id
            ? preloadUserFollowerList({
                user_id: profileData.user_id,
                limit: 100,
                offset: 0,
            })
            : [],
        profileData.user_id
            ? preloadUserFollowedList({
                user_id: profileData.user_id,
                limit: 100,
                offset: 0,
            })
            : [],
    ]);

    return (
        <UserProfileClient

            userReviewsData={userReviewData}
            initialData={profileData}
            userPostData={communityPostsData?.data || []}
            isCurrentUser={false}
            userFollowedList={userFollowedData || []}
            userFollowerList={userFollowerData || []}
        />
    );
}
