import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CallbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy query parameters từ URL
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);

            navigate('/');
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return <div>Processing login...</div>;
};

export default CallbackPage;
