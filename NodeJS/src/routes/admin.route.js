const router = require('express').Router();
const { 
    getAllArticles,
    getAllComments
} = require('../controllers/admin.controller');

router.get('/articles', getAllArticles);  
router.get('/comments', getAllComments);  

module.exports = router;
