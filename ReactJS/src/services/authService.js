import axiosClient from '@clients/axiosClient';

const signIn = async (data) => {
    return await axiosClient.post('/api/auth/login', data);
};

const register = async (data) => {
    return await axiosClient.post('/api/auth/register', data);
};

const loginWithGoogle = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
};

const logout = (refreshToken) => {
    return axiosClient.post('/api/auth/logout', refreshToken);
};

export { signIn, loginWithGoogle, logout };
