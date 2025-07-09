
export interface Author {
    username: string;
    avatar: string | null;
    userScore?: number;
    userType?: string;
    userRank?: {
        rank_no: number;
        rank_name: string;
        impact: number;
    };
}

export interface Comment {
    id: string;
    author: Author;
    content: string;
    createdAt: string;
    likeCount: number;
    replies: Comment[];
    post_id: string | number;
    post_content: string;
    user_name: string;
    user_profile_image: string;
    created_date: string;
    like_count: number;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: Author;
    communitySlug: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    comments: Comment[];
    postType?: string;
    postPoll?: {
        poll_title: string;
        answers: string[];
    };
    postPollVoted?: number;
    contentEdited?: boolean;
}
export interface CommunityPageClientProps {
    userCommunityList: any[];
    popularCommunity: any[];
    whoToFolllow: any[];
    posts: any[];
}
export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface TransformedPost {
    userVote:any
    id: string | number;
    title: string;
    content: string;
    type: 'poll' | 'image' | 'text';
    createdAt: string;
    likeCount: number;
    commentCount: number;
    author: Author;
    communitySlug: string;
    communityName: string;
    comments: Comment[];
    pollOptions?: PollOption[];
    totalVotes?: number;
    votedOption?: string | null;
    pollEndsAt?: string;
    imageUrl?: string;
    post_image?:any;
}

export interface BackendPost {
    post_id: string | number;
    post_title?: string;
    post_content: string;
    post_type: string;
    created_date: string;
    like_count: string | number | any;
    user_name: string;
    user_profile_image: string;
    community_info?: {
        community_name?: string;
    };
    comments?: Comment[];
    post_poll?: {
        poll_title?: string;
        answers?: string[];
    };
    post_poll_answers?: Array<{
        answer_no: string | number;
        count: string | number;
    }>;
    post_poll_voted?: string | number;
    post_image?: any;
}

export interface Community {
    community_id: string | number;
    community_name: string;
    community_description?: string;
    total_member?: number;
    growth?: string;
}

export interface User {
    user_id: string | number;
    user_name: string;
    user_profile_image: string;
    followers_count: number;
}

export interface UserProfile {
    data?: {
        total_posts: number;
        total_comments: number;
        total_likes: number;
        user_profile_image: string;
    };
}

export interface LoginUser {
    user_id: string | number | null;
    user_name: string;
}
// export interface CommunityClientProps {
//     initialData: {
//         posts: CommunityPostApiResponse[];
//         userCommunities: CommunityApiResponse[];
//         popularCommunities: CommunityApiResponse[];
//         whoToFollow: UserApiResponse[];
//     };
// }