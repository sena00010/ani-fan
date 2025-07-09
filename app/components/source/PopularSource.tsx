"use client";

import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  Star,
  Globe,
  Users,
  ExternalLink,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getRankBadgeStyle, getResponsiveImageSizes } from "@/utils/styleUtils";

// Move store data outside component to prevent re-creation on each render
const stores = [

  {
    id: 1,
    rank: 1,
    slug_url: "muscleconnect",
    name: "MuscleConnect",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    website: "muscleconnect.net",
    region: "Global",
    rating: 5.0,
    reviews: 9999,
    monthlyVisits: "10M+",
    trustScore: 99,
    shippingTo: ["North America", "Europe", "Asia", "Australia"],
    verified: true,
  },
];

export interface Store {
  id: number;
  rank: number;
  slug_url: string;
  name: string;
  logo: string;
  website: string;
  region: string;
  rating: number;
  reviews: number;
  monthlyVisits: string;
  trustScore: number;
  shippingTo: string[];
  verified?: boolean;
}

// Improved StoreCard with better memoization strategy
const StoreCard = memo(
  ({
    store,
    onHover,
    isHovered,
  }: {
    store: Store;
    onHover: (id: number | null) => void;
    isHovered: boolean;
  }) => {
    // Handle mouse events with useCallback
    const handleMouseEnter = useCallback(() => {
      onHover(store.id);
    }, [onHover, store.id]);

    const handleMouseLeave = useCallback(() => {
      onHover(null);
    }, [onHover]);

    // Pre-calculate shipping display
    const shippingDisplay = useMemo(() => {
      return (
        <>
          {store.shippingTo.slice(0, 3).map((region, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs mr-1.5 mb-1"
            >
              {region}
            </span>
          ))}
          {store.shippingTo.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs mr-1.5 mb-1">
              +{store.shippingTo.length - 3} more
            </span>
          )}
        </>
      );
    }, [store.shippingTo]);

    return (
      <div
        className={`p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0 relative flex justify-between items-center w-full ${
          isHovered ? "bg-blue-50/50" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 mr-3 flex justify-center">
            <div
              className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center text-sm font-bold ${getRankBadgeStyle(
                store.rank
              )}`}
            >
              {store.rank}
            </div>
          </div>

          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm relative flex-shrink-0">
            <Image
              src={store.logo}
              alt={store.name}
              fill
              className="object-cover"
              sizes={getResponsiveImageSizes("logo")}
              priority={store.rank <= 3}
              loading={store.rank <= 5 ? "eager" : "lazy"}
            />
          </div>

          <div className="ml-5 flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {store.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{store.rating}</span>
              <span className="text-gray-500 text-sm">
                ({store.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {store.region}
              </div>
              <div className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-md font-medium flex items-center gap-1">
                <Users className="w-3 h-3" />
                {store.monthlyVisits} visitors
              </div>
              <div className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded-md font-medium flex items-center gap-1">
                <span className="font-semibold">{store.trustScore}%</span>
                trust score
              </div>
            </div>
          </div>
        </div>

        <div className="w-[280px] flex flex-wrap items-center mx-auto justify-start">
          {shippingDisplay}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href={`/sources/${store.slug_url}`}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1 text-sm font-medium whitespace-nowrap"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://${store.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 text-sm text-gray-700 whitespace-nowrap"
          >
            Visit
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }
);

StoreCard.displayName = "StoreCard";

// Optimized mobile card
const MobileStoreCard = memo(({ store }: { store: Store }) => {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center justify-center">
          <div
            className={`w-9 h-9 rounded-lg shadow-sm flex items-center justify-center text-sm font-bold ${getRankBadgeStyle(
              store.rank
            )}`}
          >
            {store.rank}
          </div>
        </div>

        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
          <Image
            src={store.logo}
            alt={store.name}
            width={48}
            height={48}
            className="object-cover"
            sizes={getResponsiveImageSizes("thumbnail")}
            priority={store.rank <= 3}
            loading={store.rank <= 5 ? "eager" : "lazy"}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-sm text-gray-900">{store.name}</h3>

          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-xs">{store.rating}</span>
            <span className="text-gray-500 text-xs">
              ({store.reviews.toLocaleString()})
            </span>
          </div>
        </div>

        <Link
          href={`/sources/${store.slug_url}`}
          className="flex-shrink-0 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </Link>
      </div>
    </div>
  );
});

MobileStoreCard.displayName = "MobileStoreCard";

const PopularSource: React.FC<{ storeData?: Store[] }> = ({ storeData }) => {
  const [hoveredStore, setHoveredStore] = useState<number | null>(null);
  const sourceData = storeData || stores;

  // Debounced mouse position tracking with requestAnimationFrame for better performance
  useEffect(() => {
    let rafId: number;
    let lastX = 0;
    let lastY = 0;
    let throttleTimeout: NodeJS.Timeout | null = null;
    const THROTTLE_DELAY = 50; // 50ms throttle delay for mouse move
    const MIN_MOVEMENT = 5; // Minimal movement threshold in pixels
    
    // Optimize the mouse movement tracking with throttling
    const handleMouseMove = (e: MouseEvent) => {
      // If a throttle timeout is set, just save the latest values but don't process yet
      if (throttleTimeout) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      
      // Skip if movement is minimal
      if (Math.abs(e.clientX - lastX) < MIN_MOVEMENT && Math.abs(e.clientY - lastY) < MIN_MOVEMENT) {
        return;
      }

      lastX = e.clientX;
      lastY = e.clientY;

      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Set throttle timeout to limit frequency of updates
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
      }, THROTTLE_DELAY);

      // Schedule new update with requestAnimationFrame for better performance
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--mouse-x",
          `${e.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--mouse-y",
          `${e.clientY}px`
        );
      });
    };

    // Use passive event listener for better scroll performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, []);

  // Memoize the list of store cards to prevent unnecessary re-renders
  const desktopStoreCards = useMemo(
    () =>
      sourceData.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onHover={setHoveredStore}
          isHovered={hoveredStore === store.id}
        />
      )),
    [hoveredStore, sourceData]
  );

  // Memoize mobile store cards
  const mobileStoreCards = useMemo(
    () =>
      sourceData.map((store) => (
        <MobileStoreCard key={store.id} store={store} />
      )),
    [sourceData]
  );

  return (
    <section className="py-16 relative overflow-hidden">
      {/* getShimmerStyles fonksiyonunun doğrudan sonucunu değil, 
          styled-jsx'in bekleyebileceği bir template literal kullanıyoruz */}
      <style jsx>{`
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(30deg);
          }
          100% {
            transform: translateX(100%) rotate(30deg);
          }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "center center",
          }}
        ></div>
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 justify-center md:justify-start">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Top 10 Rated Sources
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center md:text-left md:ml-8">
            Ranked by user ratings & popularity
          </p>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
          {desktopStoreCards}
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden">
          <div className="space-y-3">{mobileStoreCards}</div>
        </div>
      </div>
    </section>
  );
};

export default memo(PopularSource);
