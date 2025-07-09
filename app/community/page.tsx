import {
    preloadCommunityPostList,
    preloadExploreCommunities,
    preloadWhoToFollow
} from '@/lib/server/preloadData';
import CommunityPageClient from './CommunityPageClient';

export default async function Page() {
    const postsRes = await preloadCommunityPostList({ limit: 10, offset: 0 });
    const popular = await preloadExploreCommunities({ limit: 10 });
    const who = await preloadWhoToFollow({ limit: 10 });

    return (
        <CommunityPageClient
            initialPosts={postsRes?.data || []}
            totalCount={postsRes?.totalCount || 0}
            popularCommunity={popular || []}
            whoToFollow={who || []}
        />
    );
}