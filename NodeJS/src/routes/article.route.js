const router = require('express').Router();
const { 
    getAllArticles, 
    getArticleBySlug, 
    createArticle, 
    deleteArticle 
} = require('../controllers/article.controller');

router.get('/', getAllArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', createArticle);
router.get('/', deleteArticle);

module.exports = router;
