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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';

  try {
    const response = await axios.get(`${API_BASE_URL}/getMangas`);
    console.log(response, "getMangas");

    if (response.data) {
      return response.data; // ✅ Sadece data kısmını döndür
    }

    return null;
  } catch (error) {
    console.error('Manga listesi getirilirken hata oluştu:', error);
    return null;
  }
}
export async function preloadGetAnimesList() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8083';

  try {
    const response = await axios.get(`${API_BASE_URL}/getAnimes`);
    console.log(response, "animes");

    if (response.data) {
      return response.data; // ✅ Sadece data kısmını döndür
    }

    return null;
  } catch (error) {
    console.error('Manga listesi getirilirken hata oluştu:', error);
    return null;
  }
}