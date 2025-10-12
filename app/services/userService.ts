const API_BASE_URL = 'http://localhost:8083';
const userService = {
    registerUser: async (userData:any) => {
        try {
            const response = await fetch('http://localhost:8083/userregister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    name: userData.name,
                    surname: userData.surname,
                    nickname: userData.nickname,
                    password: userData.password,
                    uid: userData.uid
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Backend kayıt hatası');
            }

            return await response.json();
        } catch (error) {
            console.error('UserService register error:', error);
            throw error;
        }
    },
    updateUserProfile: async (userId: string, profileData: any) => {
        try {
            console.log('Profil güncelleme isteği:', profileData);

            const response = await fetch(`${API_BASE_URL}/updateUserProfile?userId=${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            console.log('Profil güncelleme response status:', response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Profil güncelleme hatası:', errorData);
                throw new Error(errorData || 'Profil güncelleme hatası');
            }

            const result = await response.json();
            console.log('Profil başarıyla güncellendi:', result);
            return result;
        } catch (error) {
            console.error('UserService updateProfile error:', error);
            throw error;
        }
    }
};

export default userService;