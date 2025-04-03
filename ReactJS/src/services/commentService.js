import axiosClient from '@clients/axiosClient';

const getCommentsBySlug = async (slug) => {
    return await axiosClient.get(`/api/articles/${slug}/comments`);
};

const addComment = async (slug, token, data) => {
    return await axiosClient.post(`/api/articles/${slug}/comments`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export { getCommentsBySlug, addComment };
