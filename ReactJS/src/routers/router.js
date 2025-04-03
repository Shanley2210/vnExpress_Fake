import { lazy } from 'react';

const routers = [
    {
        path: '/',
        component: lazy(() => import('@pages/HomePage/HomePage'))
    },
    {
        path: '/login',
        component: lazy(() => import('@pages/Login/Login'))
    },
    {
        path: '/admin',
        component: lazy(() => import('@pages/Admin/Admin'))
    },
    {
        path: '/api/auth/callback',
        component: lazy(() => import('@components/CallBack/CallBack'))
    },
    {
        path: '/detail/:slug',
        component: lazy(() => import('@pages/Detail/Detail'))
    }
];

export default routers;
