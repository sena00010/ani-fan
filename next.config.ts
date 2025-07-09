import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // Tailwind CSS için gerekirse ek yapılandırmalar eklenebilir
    images: {
        domains: ['muscleconnect.net'],
        // veya
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'muscleconnect.net',
                pathname: '/assets/uploads/**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1/mconnect_docker/mconnect_api/api/:path*',
            }

        ];
    },
};

export default nextConfig;