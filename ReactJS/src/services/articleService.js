import axiosClient from '@clients/axiosClient';

const getAllArticles = async () => {
    return await axiosClient.get('/api/articles');
};

const getArticleBySlug = async (slug) => {
    return await axiosClient.get(`/api/articles/${slug}`);
};

export { getAllArticles, getArticleBySlug };
