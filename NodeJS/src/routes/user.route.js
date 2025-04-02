const router = require('express').Router();
const { 
    getAllUsers, 
    getUserById, 
    updateUserRole, 
    deleteUser 
} = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id',authenticateToken, deleteUser);

module.exports = router;
