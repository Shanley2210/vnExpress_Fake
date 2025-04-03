import axiosClient from '@clients/axiosClient';

const getUerInfo = async (token) => {
    return await axiosClient.get('/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export { getUerInfo };
