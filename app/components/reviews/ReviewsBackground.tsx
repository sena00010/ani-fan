import React from "react";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";

const ReviewsBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {/* Stars */}
        {[...Array(5)].map((_, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={`star-${i}`}
              className="absolute animate-float"
              style={{
                left: isLeft
                  ? `${15 + Math.random() * 15}%`
                  : `${70 + Math.random() * 15}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: "8s",
                opacity: 0.2,
              }}
            >
              <Star className="w-4 h-4 text-blue-400" />
            </div>
          );
        })}

        {/* Review Icons */}
        {[...Array(3)].map((_, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={`message-${i}`}
              className="absolute animate-float-reverse"
              style={{
                left: isLeft
                  ? `${10 + Math.random() * 10}%`
                  : `${80 + Math.random() * 10}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: "10s",
                opacity: 0.15,
              }}
            >
              <MessageCircle className="w-5 h-5 text-indigo-400" />
            </div>
          );
        })}

        {/* Like Icons */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`like-${i}`}
            className="absolute animate-float"
            style={{
              left: `${25 + i * 25}%`,
              top: `${40 + Math.random() * 20}%`,
              animationDelay: `${i * 1.8}s`,
              animationDuration: "9s",
              opacity: 0.15,
            }}
          >
            <ThumbsUp className="w-4 h-4 text-purple-400" />
          </div>
        ))}

        {/* Subtle Gradient Orbs */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse-slow" />
      </div>
    </div>
  );
};

export default ReviewsBackground;
