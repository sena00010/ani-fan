"use client";
import React, { useRef, useEffect, useState, useCallback, useMemo, KeyboardEvent } from "react";
import {
  Star,
  ShoppingBag,
  Users,
  Award,
  ChevronRight,
  Search,
  Store,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "./AnimatedBackground";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResultItem {
  type?: string;
  name?: string;
  url?: string;
}

const HomePageSearch: React.FC = () => {
  const router = useRouter();
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const highlightTextRef = useRef<HTMLSpanElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchIconRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // State for the subtitle typing effect
  const [subtitle, setSubtitle] = useState("");
  const fullSubtitle =
    "Your one-stop platform for sports reviews, community, and shopping guidance.";
  const [isDeleting, setIsDeleting] = useState(false);

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Yeni state: Klavye ile navigasyon için
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState<number>(-1);
  const allSuggestionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: searchResults } = useSearch(debouncedSearchQuery);

  // Add to ref helper - memoize to prevent unnecessary re-renders
  const addToFeatureRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  }, []);

  // Handle search input focus animation - optimized with useCallback
  useEffect(() => {
    if (!searchInputRef.current) return;

    const handleFocus = () => {
      setIsFocused(true);
      setShowSuggestions(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (!searchQuery) {
        // Use setTimeout to allow click events on suggestions to fire before hiding
        setTimeout(() => setShowSuggestions(false), 150);
      }
    };

    searchInputRef.current.addEventListener("focus", handleFocus);
    searchInputRef.current.addEventListener("blur", handleBlur);

    return () => {
      if (searchInputRef.current) {
        searchInputRef.current.removeEventListener("focus", handleFocus);
        searchInputRef.current.removeEventListener("blur", handleBlur);
      }
    };
  }, [searchQuery]);

  // Optimize typing effect with cleaner state and dependencies
  // Önceki versiyonda çok fazla bağımlılık vardı ve karmaşıktı
  useEffect(() => {
    // Use a ref to track the active timeout to ensure we can clean it up properly
    const timeoutRef = { current: 0 };
    
    const handleTypingEffect = () => {
      // Get the current state of the text
      const isCurrentlyDeleting = isDeleting;
      const currentText = subtitle;
      
      // Calculate the next state
      if (!isCurrentlyDeleting && currentText === fullSubtitle) {
        // If we've completed typing the full text, set a timeout to start deleting
        timeoutRef.current = window.setTimeout(() => {
          setIsDeleting(true);
          // When we schedule another timeout operation, clear the existing one
          clearTimeout(timeoutRef.current);
        }, 10000); // 10 second pause before deleting
        return;
      }
      
      if (isCurrentlyDeleting && currentText === "") {
        // When we've deleted everything, switch back to typing
        setIsDeleting(false);
        return;
      }
      
      // Either add or remove a character
      const direction = isCurrentlyDeleting ? -1 : 1;
      const nextIndex = currentText.length + direction;
      const nextText = isCurrentlyDeleting
        ? fullSubtitle.substring(0, nextIndex)
        : fullSubtitle.substring(0, nextIndex);
      
      // Calculate the typing speed - faster when deleting
      const nextDelay = isCurrentlyDeleting ? 10 : 25;
      
      // Set the next character with a timeout
      timeoutRef.current = window.setTimeout(() => {
        setSubtitle(nextText);
      }, nextDelay);
    };
    
    // Start the typing effect
    handleTypingEffect();
    
    // Clean up timeouts on unmount or when dependencies change
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [subtitle, isDeleting, fullSubtitle]); // Reduced dependencies

  // Feature data - memoize to prevent re-renders
  const features = useMemo(() => [
    {
      icon: <Star className="w-6 h-6 text-amber-500 feature-icon" />,
      title: "Reviews",
      description:
        "Find and share authentic customer reviews for sports stores",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-blue-500 feature-icon" />,
      title: "Source Discovery",
      description: "Discover the best local and online sports retailers",
    },
    {
      icon: <Users className="w-6 h-6 text-green-500 feature-icon" />,
      title: "Community",
      description:
        "Connect with other sports enthusiasts and share experiences",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500 feature-icon" />,
      title: "Top Brands",
      description: "Explore trending and trusted sports brands",
    },
  ], []);

  // Search category options - memoize
  const searchCategories = useMemo(() => [
    { icon: <Store className="w-4 h-4" />, label: "Sources" },
    { icon: <Star className="w-4 h-4" />, label: "Brands" },
    { icon: <Tag className="w-4 h-4" />, label: "Products" },
  ], []);

  // Search is handled by TanStack Query hook

  // Memoize handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by TanStack Query hook automatically
  }, []);

  // Mock popular searches data - memoize
  const popularSearches = useMemo(() => [
    "Nike stores nearby",
    "Best running shoes",
    "Adidas outlet reviews",
    "Basketball equipment",
  ], []);

  // Mock recent searches data - memoize
  const recentSearches = useMemo(() => [
    "Sports shops in downtown",
    "Tennis racket comparison",
  ], []);

  // Memoize search query handler for better performance
  const setSearchQueryValue = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Reset the focused suggestion index when suggestions visibility changes
  useEffect(() => {
    if (!showSuggestions) {
      setFocusedSuggestionIndex(-1);
    }
  }, [showSuggestions]);
  
  // Klavye tuşları için olay işleyicisi
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    
    const allSuggestions = [...popularSearches, ...recentSearches];
    const maxIndex = allSuggestions.length - 1;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev < maxIndex ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : maxIndex
        );
        break;
      case "Enter":
        if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex <= maxIndex) {
          e.preventDefault();
          setSearchQueryValue(allSuggestions[focusedSuggestionIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        searchInputRef.current?.blur();
        break;
    }
  }, [showSuggestions, popularSearches, recentSearches, focusedSuggestionIndex, setSearchQueryValue]);
  
  // Handle search result click
  const handleSearchResultClick = useCallback((item: SearchResultItem) => {
    if (!item.type || !item.url) return;

    let route = "";
    switch (item.type) {
      case "source":
        route = `/sources/${item.url}`;
        break;
      case "brand":
        route = `/brands/${item.url}`;
        break;
      case "product":
        route = `/brands/${item.url}`;
        break;
      case "promo":
        route = `/promos/${item.url}`;
        break;
      case "news":
        route = `/news/${item.url}`;
        break;
      default:
        return;
    }

    router.push(route);
    setShowSuggestions(false);
  }, [router]);

  // Render search suggestions
  const renderSearchSuggestions = useCallback(() => {
    if (!showSuggestions) return null;

    // Show minimum character message
    if (searchQuery.length > 0 && searchQuery.length < 3) {
      return (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 transition-opacity duration-300 opacity-100 transform translate-y-0"
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="p-4">
            <div className="text-sm text-gray-500 text-center">
              Please enter at least 3 characters to search
            </div>
          </div>
        </div>
      );
    }

    // Show no results message
    if (searchQuery.length >= 3 && (!searchResults?.data || searchResults.data.length === 0)) {
      return (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 transition-opacity duration-300 opacity-100 transform translate-y-0"
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="p-4">
            <div className="text-sm text-gray-500 text-center">
              No results found for &ldquo;{searchQuery}&rdquo;
            </div>
          </div>
        </div>
      );
    }

    // Show search results
    if (searchResults?.data) {
      const suggestions = searchResults.data.map((item: SearchResultItem, index: number) => (
        <button
          key={`${item.type}-${index}`}
          ref={(el) => {
            allSuggestionsRef.current[index] = el;
          }}
          className={`flex items-center text-left py-1.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full ${
            index === focusedSuggestionIndex ? "bg-gray-100" : ""
          }`}
          onClick={() => handleSearchResultClick(item)}
          role="option"
          aria-selected={index === focusedSuggestionIndex}
          tabIndex={-1}
        >
          {item.type === "source" && <Store className="w-3.5 h-3.5 mr-2 text-gray-400" />}
          {item.type === "brand" && <Star className="w-3.5 h-3.5 mr-2 text-gray-400" />}
          {item.type === "product" && <Tag className="w-3.5 h-3.5 mr-2 text-gray-400" />}
          {item.type === "news" && <span className="text-gray-400 mr-2">📰</span>}
          {item.type === "promo" && <span className="text-gray-400 mr-2">🎁</span>}
          {item.name}
        </button>
      ));

      return (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 transition-opacity duration-300 opacity-100 transform translate-y-0"
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="p-4">
            <div className="space-y-1" role="group">
              {suggestions}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, [showSuggestions, searchQuery, searchResults, focusedSuggestionIndex, handleSearchResultClick]);

  // Effect to scroll selected suggestion into view
  useEffect(() => {
    if (focusedSuggestionIndex >= 0 && allSuggestionsRef.current[focusedSuggestionIndex]) {
      allSuggestionsRef.current[focusedSuggestionIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [focusedSuggestionIndex]);

  return (
    <div className="pt-0">
      <div
        ref={heroSectionRef}
        className="relative min-h-[600px] flex flex-col items-center justify-center py-16 overflow-hidden rounded-b-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50"
      >
        <AnimatedBackground />
        <div
          ref={heroContentRef}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <h1
            ref={mainTitleRef}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span ref={welcomeRef} className="inline-block">
              Welcome to{" "}
            </span>
            <span ref={brandRef} className="inline-block relative ml-2">
              MuscleConnect
              <span
                ref={highlightTextRef}
                className="absolute inset-0 -z-10 bg-indigo-100 rounded-lg -m-1 p-1"
              ></span>
            </span>
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto min-h-[2rem]"
          >
            {subtitle}
            <span className="animate-pulse">|</span>
          </p>

          {/* Modern Search Bar - Erişilebilirlik için geliştirildi */}
          <div
            ref={searchBarRef}
            className={`relative max-w-2xl mx-auto mb-12 transition-all duration-300 px-2 sm:px-0 ${
              isFocused ? "scale-102 shadow-lg shadow-indigo-200" : ""
            }`}
          >
            <form 
              onSubmit={handleSearchSubmit} 
              className="relative"
              role="search"
              aria-label="Site search"
            >
              <div className="relative">
                <div
                  ref={searchIconRef}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    isFocused ? "text-indigo-500" : "text-gray-500"
                  }`}
                  aria-hidden="true"
                >
                  <Search
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isFocused ? "rotate-10" : ""
                    }`}
                  />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for sports stores, products, or reviews..."
                  className="w-full py-3 md:py-4 pl-12 pr-16 md:pr-28 bg-white text-gray-700 placeholder-gray-400 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-400 shadow-lg transition-all text-sm md:text-base"
                  aria-expanded={showSuggestions}
                  aria-autocomplete="list"
                  aria-controls={showSuggestions ? "search-suggestions" : undefined}
                  aria-activedescendant={
                    focusedSuggestionIndex >= 0 
                      ? `suggestion-${focusedSuggestionIndex}` 
                      : undefined
                  }
                />
                <button
                  type="submit"
                  className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-indigo-700 transition-all"
                  aria-label="Search"
                >
                  Search
                </button>
              </div>

              {/* Search Categories */}
              <div 
                className="flex items-center justify-center flex-wrap space-x-1 md:space-x-2 mt-3"
                role="radiogroup"
                aria-label="Search categories"
              >
                {searchCategories.map((category, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all mb-1
                          ${
                            isFocused
                              ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                              : "bg-white text-gray-600 border border-gray-200"
                          }`}
                    role="radio"
                    aria-checked="false"
                    aria-label={`Search in ${category.label}`}
                  >
                    <span className="mr-1" aria-hidden="true">{category.icon}</span>
                    {category.label}
                  </button>
                ))}

                {/* Add a trending category */}
                <button
                  type="button"
                  className="flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all mb-1 bg-amber-50 text-amber-600 border border-amber-200"
                  role="radio"
                  aria-checked="false"
                  aria-label="Search trending topics"
                >
                  <span className="mr-1" aria-hidden="true">🔥</span>
                  Trending
                </button>
              </div>

              {/* Search Suggestions Dropdown - Erişilebilirlik için geliştirilen */}
              {showSuggestions && renderSearchSuggestions()}
            </form>
          </div>

          {/* Feature Cards - Erişilebilirlik için geliştirilmiş */}
          <div
            ref={featureCardsRef}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mt-8"
            role="region"
            aria-label="Features"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                ref={addToFeatureRefs}
                className="bg-white p-3 md:p-5 rounded-xl shadow-md flex flex-col items-center text-center transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-2"
                tabIndex={0} // Klavye erişilebilirliği için
                role="button"
                aria-label={`Learn more about ${feature.title}`}
              >
                <div 
                  className="p-2 md:p-3 bg-gray-50 rounded-full mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 transition-colors duration-300 hover:text-indigo-600">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          


        </div>
      </div>
    </div>
  );
};

export default React.memo(HomePageSearch);
