"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    // her client oturumu için tek QueryClient
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 10_000,        // 10sn taze say
                        refetchOnWindowFocus: false,
                        retry: 2,
                    },
                },
            })
    );

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
            </QueryClientProvider>
        </AuthProvider>
    );
}
