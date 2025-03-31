const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Op } = require('sequelize');
const { User } = require('../models');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({
                    where: {
                        [Op.or]: [
                            { google_id: profile.id },
                            { email: profile.emails[0].value }
                        ]
                    }
                });

                if (!user) {
                    const newUser = await User.create({
                        google_id: profile.id,
                        email: profile.emails[0].value,
                        display_name: profile.displayName,
                        is_verified: true
                    });
                    return done(null, newUser);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
