"use client";

import React, { useState, useEffect, useRef, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  items: React.ReactNode[];
  itemsToShow?: number;
  autoPlayInterval?: number;
  showDots?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  items = [],
  itemsToShow = 4,
  autoPlayInterval = 5000,
  showDots = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [responsiveItemsToShow, setResponsiveItemsToShow] =
    useState(itemsToShow);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Ensure we have valid items
  const validItems = Array.isArray(items) ? items : [];
  const totalItems = validItems.length;

  const updateResponsiveItems = () => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    if (width < 640) {
      setResponsiveItemsToShow(1);
    } else if (width < 1024) {
      setResponsiveItemsToShow(2);
    } else if (width < 1280) {
      setResponsiveItemsToShow(3);
    } else {
      setResponsiveItemsToShow(itemsToShow);
    }
  };

  useEffect(() => {
    updateResponsiveItems();

    const handleResize = () => {
      updateResponsiveItems();
      // Ensure current index is valid after resize
      const maxIndex = Math.max(0, totalItems - responsiveItemsToShow);
      setCurrentIndex((prev) => Math.min(prev, maxIndex));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalItems, itemsToShow, responsiveItemsToShow]);

  useEffect(() => {
    if (!isDragging && totalItems > responsiveItemsToShow) {
      const interval = setInterval(() => {
        const maxIndex = Math.max(0, totalItems - responsiveItemsToShow);
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [
    currentIndex,
    isDragging,
    totalItems,
    responsiveItemsToShow,
    autoPlayInterval,
  ]);

  const next = () => {
    if (totalItems <= responsiveItemsToShow) return;
    const maxIndex = Math.max(0, totalItems - responsiveItemsToShow);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    if (totalItems <= responsiveItemsToShow) return;
    const maxIndex = Math.max(0, totalItems - responsiveItemsToShow);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStart === null) return;
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (touchStart === null || touchEnd === null) return;

    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        next();
      } else {
        prev();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const totalSlides = Math.ceil(totalItems / responsiveItemsToShow);
  const currentSlide = Math.floor(currentIndex / responsiveItemsToShow);

  if (!totalItems) return null;

  return (
    <div className="relative group">
      <div
        ref={carouselRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${
              (currentIndex * 100) / responsiveItemsToShow
            }%)`,
          }}
        >
          {validItems.map((item, index) => (
            <div
              key={index}
              className="flex-none px-2"
              style={{ width: `${100 / responsiveItemsToShow}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {totalItems > responsiveItemsToShow && (
        <>
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {showDots && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? "bg-blue-600 w-8" : "bg-gray-300 w-2"
                  }`}
                  onClick={() => setCurrentIndex(i * responsiveItemsToShow)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carousel;
