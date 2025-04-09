const router = require('express').Router();
const {
    googleAuth,
    googleCallback,
    registerAccount,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
    getUserInfo
} = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

router.post('/register', registerAccount);
// router.post('/verify-email', verifyEmail);
// router.post('/resend-verification', resendVerification);

router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/refresh-token', refreshToken);

router.post('/logout', logout);

router.get('/me', authenticateToken, getUserInfo);

module.exports = router;
