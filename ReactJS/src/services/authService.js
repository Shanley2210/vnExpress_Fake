import axiosClient from '@clients/axiosClient';

const signIn = async (data) => {
    return await axiosClient.post('/api/auth/login', data);
};

const register = async (data) => {
    return await axiosClient.post('/api/auth/register', data);
};

export { signIn };
