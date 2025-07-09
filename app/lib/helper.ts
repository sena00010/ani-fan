export const timeSince = (dateString: string): string => {
    if (typeof dateString === 'string' && dateString.includes('ago')) {
        return dateString;
    }

    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
};
export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateUsername = (username: string) => {
    return username.length >= 4 && !username.includes(" ");
};

export const validatePassword = (password: string) => {
    return password.length >= 6 && !password.includes(" ");
};

export const formatTimestamp = (timestamp: string) => {
    try {
        // Handle both "X months ago" format and ISO dates
        if (timestamp.includes('ago')) {
            return timestamp;
        }

        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return timestamp;
        }

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString();
    } catch (error) {
        return timestamp;
    }
};
export const getCommunityColor = (slug: string): string => {
    const colors = ['#FF4500', '#0079D3', '#1E88E5', '#FF9800', '#388E3C', '#7E57C2'];
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};
// Format timestamp to "X time ago" format
    export const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return `1 year ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return `1 month ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return `1 day ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return `1 hour ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return `1 minute ago`;

    return `${Math.floor(seconds)} seconds ago`;
};