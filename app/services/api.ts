import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Cache için interface tanımı
interface CacheItem {
  data: Record<string, unknown>;
  timestamp: number;
}

// Genişletilmiş config için interface
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  cacheActive?: boolean;
  cacheData?: Record<string, unknown>;
  noCache?: boolean;
}

// Cache mekanizması için Map oluşturuyoruz
const cache = new Map<string, CacheItem>();

// Axios instance oluşturuyoruz
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000, // 15 saniye timeout
});

// Request interceptor - API isteklerini yakalar
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const customConfig = config as unknown as CustomAxiosRequestConfig;
      // Cache kontrolü yalnızca cacheActive true ise yapılacak
      if (customConfig.cacheActive) {
        const cacheKey =
            config.url + JSON.stringify(customConfig.cacheData || {});

        // Eğer noCache true ise, önbellek kontrolü yapılmayacak
        if (customConfig.noCache) {
          return config;
        }

        const cachedData = cache.get(cacheKey);

        // Cache süresi kontrolü (5 dakika)
        if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          return Promise.reject({
            config,
            response: {
              data: cachedData.data,
              status: 200,
              cached: true,
            },
          });
        }
      }

      // Basic auth ve API key ekle
      const username = process.env.NEXT_PUBLIC_API_USERNAME;
      const password = process.env.NEXT_PUBLIC_API_PASSWORD;

      if (username && password) {
        const authString = `${username}:${password}`;
        const encodedAuthString = btoa(authString);

        // Header ataması için Axios'un kendi header yönetimini kullanıyoruz
        config.headers.set("Authorization", `Basic ${encodedAuthString}`);

        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        if (apiKey) {
          config.headers.set(apiKey, process.env.NEXT_PUBLIC_API_KEY_VALUE || "");
        }

        // Login token varsa ekle
        if (typeof window !== "undefined") {
          const loginToken = localStorage.getItem("mconnect_login_token");
          if (loginToken) {
            config.headers.set("mconnect-token", loginToken);
          }
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Response interceptor - API cevaplarını yakalar
api.interceptors.response.use(
    (response: AxiosResponse) => {
      // Başarılı cevapları cache'e ekle
      const config = response.config as unknown as CustomAxiosRequestConfig;
      const cacheKey = config.url + JSON.stringify(config.data || {});
      cache.set(cacheKey, {
        data: response.data as Record<string, unknown>,
        timestamp: Date.now(),
      });

      return response;
    },
    (error: unknown) => {
      // Eğer cache'den gelen bir hata ise, cache verisini döndür
      if (typeof error === "object" && error !== null && "response" in error) {
        const errorObj = error as { response?: { cached?: boolean } };
        if (errorObj.response?.cached) {
          return Promise.resolve(errorObj.response);
        }
      }

      return Promise.reject(error);
    }
);

// Cache temizleme fonksiyonu
export const clearCache = (url: string | null = null) => {
  if (url) {
    // Belirli bir URL için cache'i temizle
    for (const key of cache.keys()) {
      if (key.startsWith(url)) {
        cache.delete(key);
      }
    }
  } else {
    // Tüm cache'i temizle
    cache.clear();
  }
};

// Request batching için yardımcı fonksiyon
export const batchRequests = async (
    requests: CustomAxiosRequestConfig[],
    batchSize = 3
) => {
  const results: AxiosResponse[] = [];
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((req) => api(req)));
    results.push(...batchResults);
  }
  return results;
};

export default api;
