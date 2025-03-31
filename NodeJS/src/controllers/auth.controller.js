const passport = require('passport');
const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');

exports.googleAuth = passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
});

exports.googleCallback = async (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
        if (err) return next(err);

        try {
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            RefreshToken.create({
                user_id: user.id,
                token: refreshToken,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            res.redirect(
                `${process.env.FRONTEND_URL}/api/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
            );
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};
