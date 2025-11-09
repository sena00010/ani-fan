import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

interface SearchParams {
  searchText: string;
}

interface SearchResult {
  type?: string;
  name?: string;
  url?: string;
}

interface SearchResponse {
  data?: SearchResult[];
  status?: boolean;
}

export const useSearch = (searchText: string) => {
  return useQuery<SearchResponse>({
    queryKey: ["search", searchText],
    queryFn: async () => {
      if (!searchText || searchText.length < 3) {
        return { data: [] };
      }
      const response = await api.post("/search", { searchText });
      return response.data;
    },
    enabled: searchText.length >= 3,
    staleTime: 10000, // 10 saniye
  });
};






