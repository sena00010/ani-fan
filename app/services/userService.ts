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
    }
};

export default userService;