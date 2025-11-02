// lib/server/auth.ts
import { cookies } from 'next/headers';

export function getServerUser() {
  const cookieStore = cookies();
  const userUid = cookieStore.get('user_uid')?.value;
  const userEmail = cookieStore.get('user_email')?.value;

  return {
    uid: userUid || null,
    email: userEmail || null,
    isAuthenticated: !!userUid
  };
}

// lib/server/preloadData.ts
import axios from "axios";
export async function preloadNewsList() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';

  try {
    const response = await axios.get(`${API_BASE_URL}/news`);
    console.log(response, "news");

    if (response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('News listesi getirilirken hata oluştu:', error);
    return null;
  }
}

export async function preloadNewsDetail(newsId: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';

  try {
    // ✅ URL'yi konsola yazdır
    const url = `${API_BASE_URL}/news/fetch-detail?news_id=${newsId}`;
    console.log('Fetching URL:', url);
    console.log('News ID:', newsId);

    const response = await axios.get(url);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('News detayı getirilirken hata oluştu:', error);
    }
    return null;
  }
}
export async function preloadUserProfileInformation(userId: string | null) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';

  try {
    if (!userId) {
      console.warn('Kullanıcı ID bulunamadı');
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/getUserProfileInformation`, {
      params: { userId }
    });
    console.log(response,"senaresponse");

    if (response.data && response.data.user) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('Kullanıcı profil bilgilerini getirme hatası:', error);
    return null;
  }
}
export async function preloadGetMangasList() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';
  const endpoint = `${API_BASE_URL}/getMangas`;

  try {
    console.log('🔄 Fetching mangas from:', endpoint);
    console.log('🔧 API_BASE_URL:', API_BASE_URL);
    
    const response = await axios.get(endpoint, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) => status < 500,
    });

    console.log('📊 Mangas response status:', response.status);
    console.log('📦 Mangas response headers:', response.headers);
    
    if (response.status !== 200) {
      console.error('❌ Mangas endpoint returned status:', response.status);
      console.error('❌ Response data:', response.data);
      return null;
    }

    if (!response.data) {
      console.warn('⚠️ Mangas response has no data');
      return null;
    }

    // Handle different response structures
    let mangaData;
    if (Array.isArray(response.data)) {
      mangaData = { Mangas: response.data };
    } else if (response.data.Mangas && Array.isArray(response.data.Mangas)) {
      mangaData = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      mangaData = { Mangas: response.data.data };
    } else if (response.data.mangas && Array.isArray(response.data.mangas)) {
      mangaData = { Mangas: response.data.mangas };
    } else {
      console.warn('⚠️ Unexpected mangas data structure:', Object.keys(response.data));
      mangaData = response.data;
    }

    console.log('✅ Processed mangas count:', mangaData.Mangas?.length || 0);
    return mangaData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error fetching mangas:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response',
        request: error.request ? {
          url: endpoint,
          method: error.config?.method
        } : 'No request',
        url: endpoint
      });
    } else {
      console.error('❌ Unknown error fetching mangas:', error);
    }
    return null;
  }
}
export async function preloadGetAnimesList() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';
  const endpoint = `${API_BASE_URL}/getAnimes`;

  try {
    console.log('🔄 Fetching animes from:', endpoint);
    console.log('🔧 API_BASE_URL:', API_BASE_URL);
    
    const response = await axios.get(endpoint, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) => status < 500,
    });

    console.log('📊 Animes response status:', response.status);
    console.log('📦 Animes response headers:', response.headers);
    
    if (response.status !== 200) {
      console.error('❌ Animes endpoint returned status:', response.status);
      console.error('❌ Response data:', response.data);
      return null;
    }

    if (!response.data) {
      console.warn('⚠️ Animes response has no data');
      return null;
    }

    // Handle different response structures
    let animeData;
    if (Array.isArray(response.data)) {
      animeData = { Animes: response.data };
    } else if (response.data.Animes && Array.isArray(response.data.Animes)) {
      animeData = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      animeData = { Animes: response.data.data };
    } else if (response.data.animes && Array.isArray(response.data.animes)) {
      animeData = { Animes: response.data.animes };
    } else {
      console.warn('⚠️ Unexpected animes data structure:', Object.keys(response.data));
      animeData = response.data;
    }

    console.log('✅ Processed animes count:', animeData.Animes?.length || 0);
    return animeData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Axios Error fetching animes:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response',
        request: error.request ? {
          url: endpoint,
          method: error.config?.method
        } : 'No request',
        url: endpoint
      });
    } else {
      console.error('❌ Unknown error fetching animes:', error);
    }
    return null;
  }
}