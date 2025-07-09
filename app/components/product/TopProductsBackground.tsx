import React from "react";
import { ShoppingBag, Package, Tag, Truck } from "lucide-react";

const TopProductsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {/* Shopping Bags */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`bag-${i}`}
            className="absolute animate-float"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i * 12) % 40}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: "8s",
              opacity: 0.2,
            }}
          >
            <ShoppingBag className="w-5 h-5 text-blue-400" />
          </div>
        ))}

        {/* Packages */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`package-${i}`}
            className="absolute animate-float-reverse"
            style={{
              right: `${20 + i * 20}%`,
              top: `${30 + (i * 10) % 30}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: "9s",
              opacity: 0.15,
            }}
          >
            <Package className="w-4 h-4 text-purple-400" />
          </div>
        ))}

        {/* Price Tags */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`tag-${i}`}
            className="absolute animate-float"
            style={{
              left: `${25 + i * 20}%`,
              bottom: `${25 + (i * 12) % 30}%`,
              animationDelay: `${i * 1.8}s`,
              animationDuration: "10s",
              opacity: 0.15,
            }}
          >
            <Tag className="w-4 h-4 text-indigo-400" />
          </div>
        ))}

        {/* Delivery Trucks */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`truck-${i}`}
            className="absolute animate-float-reverse"
            style={{
              right: `${30 + i * 25}%`,
              bottom: `${30 + (i * 10) % 20}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: "12s",
              opacity: 0.2,
            }}
          >
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse-slow" />
      </div>
    </div>
  );
};

export default TopProductsBackground;
