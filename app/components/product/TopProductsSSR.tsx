import React from "react";
import { preloadTopProducts } from "@/lib/server/preloadData";
import TopProducts from "./TopProducts";

// Define the API response type based on what's returned from the API
type ApiResponse = {
  product_id: string;
  product_name: string;
  product_slug_url: string;
  product_image: string;
  product_rating: number;
  brand_name: string;
  brand_slug_url: string;
  category_id: string;
  category_name: string;
  review_count: number;
  min_price: number;
  max_price: number;
  price_count: number;
  view_count: number;
  percent_cheaper: number;
  price_diffrence: number;
};

// Transform API data to match the format expected by TopProducts
const transformApiData = (apiData: ApiResponse[]) => {
  return apiData.map((item) => {
    return {
      id: parseInt(item.product_id),
      name: item.product_name,
      category: item.category_name,
      image: item.product_image,
      rating: item.product_rating, //yok
      reviews: item.review_count || 0,
      priceRange: {
        min: item.min_price || 0,
        max: item.max_price || 0,
      },
      percent_cheaper: item.percent_cheaper || 0,
      price_diffrence: item.price_diffrence || 0,
      brand: item.brand_name,
      stores: item.price_count || 0,
      brandSlug: item.brand_slug_url,
      productSlug: item.product_slug_url,
      viewCount: item.view_count || 0,
    };
  });
};

async function TopProductsSSR({
  limit = 8,
  brand_id = 0,
}: {
  limit?: number;
  brand_id?: number | string;
}) {
  const topProductsData = await preloadTopProducts(limit, brand_id);

  const transformedData = topProductsData
    ? transformApiData(topProductsData)
    : undefined;

  return <TopProducts productsData={transformedData} />;
}

export default TopProductsSSR;
