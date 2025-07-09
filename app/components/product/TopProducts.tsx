"use client";
import React from "react";
import Image from "next/image";
import {
  Star,
  Trophy,
  Store,
  Medal,
  Award,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import TopProductsBackground from "./TopProductsBackground";

import Link from "next/link";

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  stores: number;
  priceRange: {
    min: number;
    max: number;
  };
  percent_cheaper: number;
  brandId?: number;
  brandSlug?: string;
  productSlug?: string;
  viewCount?: number;
  price_diffrence: number;
}

// Default products data, will be used if no data is provided via props
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "MuscleConnect",
    category: "Running Shoes",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    rating: 4.8,
    reviews: 12500,
    stores: 12,
    priceRange: {
      min: 275.99,
      max: 399.99,
    },
    percent_cheaper: 20,
    price_diffrence: 100,
  },
].sort((a, b) => b.reviews - a.reviews);

interface TopProductsProps {
  productsData?: Product[];
}

const TopProducts: React.FC<TopProductsProps> = ({ productsData }) => {
  // Use provided productsData or fall back to default products
  const products = productsData || defaultProducts;

  return (
    <section className="relative py-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-violet-50/80 rounded-3xl py-8 mb-12 overflow-hidden">
          <TopProductsBackground />
          <div className="relative z-10 text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 mb-3">
              Top Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our highest-rated and most reviewed athletic products,
              chosen by our community of sports enthusiasts.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const rank = products.findIndex((p) => p.id === product.id) + 1;
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full relative group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {/* Badge for top 3 products */}
                {rank <= 3 && (
                  <div
                    className={`absolute top-3 left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      rank === 1
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : rank === 2
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : "bg-gradient-to-br from-amber-500 to-amber-700"
                    }`}
                  >
                    {rank === 1 ? (
                      <Trophy className="w-5 h-5 text-white" />
                    ) : rank === 2 ? (
                      <Medal className="w-5 h-5 text-white" />
                    ) : (
                      <Award className="w-5 h-5 text-white" />
                    )}
                  </div>
                )}

                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Brand badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
                    {product.brand}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-1">
                    <span className="text-sm text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-semibold mb-2 line-clamp-2"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({product.reviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.priceRange.min.toFixed(2)}
                      </span>
                      {product.percent_cheaper > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.priceRange.max.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {product.percent_cheaper > 0 && (
                      <p className="text-sm text-green-600 font-medium mb-3">
                        Save {product.percent_cheaper}% ($
                        {product.price_diffrence.toFixed(2)})
                      </p>
                    )}

                    <div className="text-sm text-gray-500 mb-4">
                      Available at {product.stores} stores
                    </div>

                    <Link
                      href={`/brands/${product.brandSlug}/${product.productSlug}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <div className="relative z-10 flex items-center gap-1">
                        <Store className="w-4 h-4" />
                        <span>See All Offers</span>
                      </div>
                      <div className="absolute right-4 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* "View All" Link */}
        <div className="mt-10 text-center">
          <Link
            href="/product-price-matcher"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-indigo-700 transition-colors group"
          >
            <span>View All Products</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
