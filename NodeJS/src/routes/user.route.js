const router = require('express').Router();
const { 
    getAllUsers, 
    getUserById, 
    updateUserRole, 
    deleteUser 
} = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id/role', authenticateToken, updateUserRole);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
