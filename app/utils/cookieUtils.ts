export const setTokenCookie = (token: string) => {
    if (typeof document !== "undefined") {
        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = `mconnect_login_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${
            process.env.NODE_ENV === 'production' ? '; Secure' : ''
        }`;
    }
};

export const removeTokenCookie = () => {
    if (typeof document !== "undefined") {
        document.cookie = "mconnect_login_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
};

