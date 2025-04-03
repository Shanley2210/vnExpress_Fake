import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const axiosClient = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    async (config) => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

axiosClient.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalRequest = err.config;

        if (err.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get('refreshToken');

            if (!refreshToken) {
                Cookies.remove('refreshToken');
                Cookies.remove('accessToken');
                return Promise.reject(new Error('Refresh token không hợp lệ'));
            }

            try {
                const res = await axiosClient.post('/auth/refresh-token', {
                    refreshToken
                });

                const newAccessToken = res.data.accessToken;

                Cookies.set('accessToken', newAccessToken, { expires: 1 });

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (error) {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');

                return Promise.reject(error);
            }
        }

        return Promise.reject(err);
    }
);

export default axiosClient;
