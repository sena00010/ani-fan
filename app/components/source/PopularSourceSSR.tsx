import React from "react";
import { preloadTopSources } from "@/lib/server/preloadData";
import PopularSource from "./PopularSource";
import { Store } from "./PopularSource";

type ApiResponse = {
  source_id: string;
  source_name: string;
  source_slug_url: string;
  source_profile_image: string;
  source_verification_status: boolean;
  source_rating: number;
  source_country: string;
  source_website: string;
  source_delivery_countries: string[];
  review_count: number;
  total_visits: string;
  trust_score: number;
  rank: number;
};

const transformApiData = (apiData: ApiResponse[]): Store[] => {
  return apiData.map((item, index) => {
    return {
      id: parseInt(item.source_id),
      rank: index + 1,
      slug_url: item.source_slug_url,
      name: item.source_name,
      logo: item.source_profile_image,
      website: item.source_website,
      region: item.source_country || "Global",
      rating: parseFloat(item.source_rating.toFixed(1)),
      reviews: item.review_count || 0,
      monthlyVisits: item.total_visits || "N/A",
      trustScore: item.trust_score || 0,
      shippingTo: item.source_delivery_countries || ["N/A"],
      verified: item.source_verification_status,
    };
  });
};

async function PopularSourceSSR({
  categoryId = 0,
}: {
  categoryId?: number | string;
}) {
  const topSourcesData = await preloadTopSources(categoryId);

  const transformedData = topSourcesData
    ? transformApiData(topSourcesData)
    : undefined;

  return <PopularSource storeData={transformedData} />;
}

export default PopularSourceSSR;
