import { preloadLatestReviews } from "@/lib/server/preloadData";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import Carousel from "../common/Carousel";
import ReviewsBackground from "./ReviewsBackground";

interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
  rating: number;
  review: string;
  time: string;
  type: "source" | "brand";
  entityId: number;
  entityName: string;
  entitySlug: string;
  entityLogo: string;
}

// Define API response types
interface SourceReviewApiResponse {
  rating_id: string;
  user_name?: string;
  user_profile_image?: string;
  user_live_in?: string;
  rating: number;
  review_comment?: string;
  created_date?: string;
  source_id: string;
  source_name?: string;
  source_slug_url?: string;
  source_profile_image?: string;
}

interface BrandReviewApiResponse {
  rating_id: string;
  user_name?: string;
  user_profile_image?: string;
  user_live_in?: string;
  rating: number;
  review_comment?: string;
  created_date?: string;
  brand_id: string;
  brand_name?: string;
  brand_slug_url?: string;
  brand_profile_image?: string;
}

// Transform API data into our component format
const transformApiData = (
    sourceReviews: SourceReviewApiResponse[],
    brandReviews: BrandReviewApiResponse[]
): Review[] => {
  console.log(sourceReviews, "sourceReviews");
  console.log(brandReviews, "brandReviews");
  const transformedSourceReviews = sourceReviews.map((item) => ({
    id: parseInt(item.rating_id),
    user: {
      name: item.user_name || "",
      avatar: item.user_profile_image || "",
      location: item.user_live_in || "",
    },
    rating: parseFloat(item.rating.toString()) || 5,
    review: item.review_comment || "",
    time: item.created_date || "",
    type: "source" as const,
    entityId: parseInt(item.source_id),
    entityName: item.source_name || "",
    entitySlug: item.source_slug_url || "",
    entityLogo: item.source_profile_image || "",
  }));

  const transformedBrandReviews = brandReviews.map((item) => ({
    id: parseInt(item.rating_id),
    user: {
      name: item.user_name || "",
      avatar: item.user_profile_image || "",
      location: item.user_live_in || "",
    },
    rating: parseFloat(item.rating.toString()) || 5,
    review: item.review_comment || "",
    time: item.created_date || "",
    type: "brand" as const,
    entityId: parseInt(item.brand_id),
    entityName: item.brand_name || "",
    entitySlug: item.brand_slug_url || "",
    entityLogo: item.brand_profile_image || "",
  }));

  // Combine and sort by date (assuming the most recent reviews come first in the API)
  return [...transformedSourceReviews, ...transformedBrandReviews].slice(0, 10);
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[300px] transform hover:scale-105 transition-all duration-300 flex flex-col z-10 relative mb-8">
      <div className="flex items-center gap-4 mb-4">
        {review.user.avatar ? (
            <Image
                src={review.user.avatar}
                alt={review.user.name}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
            />
        ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-blue-500 flex-shrink-0"></div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-lg truncate max-w-[150px]">
              {review.user.name}
            </h4>
          </div>
          <p className="text-sm text-gray-500 truncate">{review.user.location}</p>
          <p className="text-sm text-gray-400">{review.time}</p>
        </div>
      </div>

      <h3 className="font-bold text-xl mb-2 truncate">{review.entityName}</h3>

      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 flex-shrink-0 ${
                    i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ))}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{review.review}</p>
    </div>
);
console.log("jgdf");
async function LatestReviews() {
  const { sourceReviews, brandReviews } = await preloadLatestReviews();
  console.log(sourceReviews, "sourceReviews");
  console.log(brandReviews, "brandReviews");
  // Transform the API data into our component format
  const reviews = transformApiData(sourceReviews, brandReviews);

  return (
      <section className="relative py-6 overflow-visible">
        <div className="container mx-auto px-4 grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="relative bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-violet-50/80 rounded-3xl py-8 mb-6 overflow-hidden">
              <ReviewsBackground />
              <div className="relative z-10 text-center px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 mb-3">
                  Latest Reviews
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Read authentic reviews from our community of sports enthusiasts
                  and make informed decisions about your next purchase.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 overflow-visible pb-8">
            <div className="px-2 py-2">
              <Carousel
                  items={reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                  ))}
                  itemsToShow={4}
                  autoPlayInterval={5000}
                  showDots={false}
              />
            </div>
          </div>
        </div>
      </section>
  );
}

export default LatestReviews;
