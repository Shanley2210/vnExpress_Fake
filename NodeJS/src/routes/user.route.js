const router = require('express').Router();
const { 
    getAllUsers, 
    getUserById, 
    updateUserRole, 
    deleteUser 
} = require('../controllers/user.controller');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
