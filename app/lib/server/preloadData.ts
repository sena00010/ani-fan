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

    if (response.data && response.data.user) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('Kullanıcı profil bilgilerini getirme hatası:', error);
    return null;
  }
}
