const router = require('express').Router();
const { 
    getAllArticles, 
    getArticleBySlug, 
    createArticle, 
    deleteArticle 
} = require('../controllers/article.controller'); 

const authenticationToken = require('../middlewares/authenticateToken'); 

router.get('/', getAllArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', authenticationToken, createArticle);
router.delete('/:id', authenticationToken, deleteArticle); 

module.exports = router;
