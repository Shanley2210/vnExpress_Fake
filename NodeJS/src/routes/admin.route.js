const router = require('express').Router();
const { 
    getAllArticles,
    getAllComments
} = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/articles', authenticateToken, getAllArticles);  
router.get('/comments',authenticateToken, getAllComments);  

module.exports = router;
