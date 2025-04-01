const router = require('express').Router();

const {
    getCommentsByArticleSlug,
    addCommentToArticle,
    deleteComment
} = require('../controllers/comment.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/articles/:slug/comments', getCommentsByArticleSlug);
router.post('/articles/:slug/comments', authenticateToken, addCommentToArticle);
router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;
