/**
 * Rank badge stilleri için yardımcı fonksiyon
 * Sıralama numarasına göre uygun stil sınıflarını döndürür
 */
export const getRankBadgeStyle = (rank: number): string => {
  if (rank === 1) {
    return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white relative shimmer-effect";
  } else if (rank === 2) {
    return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
  } else if (rank === 3) {
    return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
  } else {
    return "bg-gradient-to-r from-blue-500 to-purple-500 text-white";
  }
};

/**
 * Rank badge stilleri için alternatif yardımcı fonksiyon 
 * (Farklı arka plan renkleri kullanılan bileşenler için)
 */
export const getFeatureRankBadgeStyle = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-400 shadow-[0_0_10px_rgba(156,163,175,0.5)]";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.5)]";
    default:
      return "bg-gradient-to-r from-blue-500 to-indigo-600";
  }
};

/**
 * Shimmer efekti için CSS string döndüren yardımcı fonksiyon
 */
export const getShimmerStyles = (): string => {
  return `
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
  `;
};

/**
 * Image bileşeni için uygun sizes özelliği döndüren yardımcı fonksiyon
 */
export const getResponsiveImageSizes = (
  type: "avatar" | "logo" | "product" | "banner" | "thumbnail" = "logo"
): string => {
  switch (type) {
    case "avatar":
      return "(max-width: 640px) 40px, (max-width: 768px) 48px, 64px";
    case "logo":
      return "(max-width: 640px) 48px, (max-width: 768px) 64px, 96px";
    case "product":
      return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
    case "banner":
      return "(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 80vw";
    case "thumbnail":
      return "(max-width: 640px) 80px, (max-width: 768px) 100px, 120px";
    default:
      return "100vw";
  }
}; 