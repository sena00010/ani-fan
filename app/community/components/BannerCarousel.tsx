import React from 'react';

interface BannerCarouselProps {
  banners: Array<{
    url: string;
    title: string;
  }>;
  activeIndex: number;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, activeIndex }) => (
  <div className="relative w-full h-full">
    {banners.map((banner, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          index === activeIndex ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={banner.url}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
    ))}
  </div>
);

export default BannerCarousel;

