const passport = require('passport');
const jwt = require('jsonwebtoken');
const { RefreshToken, User } = require('../models');
const bcrypt = require('bcryptjs');
const { compare } = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { access } = require('fs');

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

exports.registerAccount = async (req, res) => {
    try {
        const { email, password, display_name } = req.body;

        if (!email || !password || !display_name) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res
                .status(400)
                .json({ errCode: 2, errMessage: 'Email đã tồn tại' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await User.create({
            email,
            password,
            display_name,
            role: 'reader',
            is_verified: false,
            verification_token: verificationToken
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const userResponse = {
            id: newUser.id,
            email: newUser.email,
            display_name: newUser.display_name,
            role: newUser.role
        };

        await transporter.sendMail({
            from: process.env.EMAIL_USER_NAME,
            to: email,
            subject: 'Verify Your Email',
            //Kiểm tra lại
            html: `Click <a href=" ${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verificationToken}">here</a> to verify your email.`
        });

        res.status(201).json({
            errCode: 0,
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực',
            // verificationToken,
            user: userResponse
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res
                .status(400)
                .json({ errCode: 1, errMessage: 'Không tìm thấy token' });
        }

        const user = await User.findOne({
            where: { verification_token: token }
        });

        if (!user || user.is_verified) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        await user.update({ is_verified: true, verification_token: null });
        res.status(200).json({
            errCode: 0,
            message: 'Email xác thực thành công!'
        });
    } catch (error) {
        console.error('Lỗi xác thực email:', error);
        res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json({ errCode: 1, errMessage: 'Không tìm thấy email' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || user.is_verified) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Không tìm thấy người dùng hoặc đã được xác thực'
            });
        }

        const newToken = crypto.randomBytes(32).toString('hex');
        await user.update({ verification_token: newToken });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `Click <a href="http://yourdomain.com/api/auth/verify-email?token=${newToken}">here</a> to verify your email.`
        });

        res.status(200).json({
            errCode: 0,
            message: 'Email xác thuực đã được gửi thành công'
        });
    } catch (error) {
        console.error('Lỗi gửi lại xác thực email:', error);
        res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                errCode: 2,
                errMessage: 'Không tìm thấy email'
            });
        }

        if (!user.is_verified) {
            return res.status(401).json({
                errCode: 3,
                errMessage:
                    'Email chưa xác thực, vui lòng kiểm tra email để xác thực'
            });
        }

        if (!user.password) {
            return res.status(401).json({
                errCode: 4,
                errMessage: 'Mật khẩu không hợp lệ'
            });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

        await RefreshToken.create({
            user_id: user.id,
            token: refreshToken,
            expires_at: refreshTokenExpiresAt
        });

        res.status(200).json({
            errCode: 0,
            message: 'Đăng nhập thành công',
            accessToken: token,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                display_name: user.display_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ errCode: 1, errMessage: 'Email không được để trống' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Không tìm thấy email'
            });
        }

        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 3600000);
            await user.update({
                reset_password_token: token,
                reset_token_expiry: expiry
            });

            const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER_NAME,
                to: email,
                subject: 'Reset Your Password',
                html: `Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.`
            });
        }
        res.status(200).json({
            errCode: 0,
            message: 'Gửi yêu cầu thành công, vui lòng kiểm tra email'
        });
    } catch (error) {
        console.error('Lỗi quên mật khẩu:', error);
        res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Token và mật khẩu mới không được trống'
        });
    }
    try {
        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_token_expiry: { [Op.gt]: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({
                errCode: 2,
                errMessage: 'Token không hợp lệ hoặc hết hạn'
            });
        }
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await user.update({
            password: hashedPassword,
            reset_password_token: null,
            reset_token_expiry: null
        });

        res.status(200).json({
            errCode: 0,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        console.error('Lỗi reset mật khẩu:', error);
        res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Refresh token không được để trống'
        });
    }
    try {
        const tokenRecord = await RefreshToken.findOne({
            where: { token: refreshToken },
            include: [{ model: User }],
            raw: false
        });

        if (!tokenRecord) {
            return res
                .status(401)
                .json({ errCode: 2, errMessage: 'Refresh token không hợp lệ' });
        }

        if (tokenRecord.revoked) {
            return res.status(401).json({
                errCode: 3,
                errMessage: 'Refresh token đã bị thu hồi'
            });
        }

        if (tokenRecord.expires_at < new Date()) {
            return res
                .status(401)
                .json({ errCode: 4, errMessage: 'Refresh token đã hết hạn' });
        }

        const user = tokenRecord.User;

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ errCode: 0, newToken: accessToken });
    } catch (error) {
        console.error('Lỗi refresh token:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Refresh token không được trống'
            });
        }

        const refreshTokenQuery = await RefreshToken.findOne({
            where: { token: refreshToken },
            include: [{ model: User }]
        });

        if (!refreshTokenQuery) {
            return res.status(401).json({
                errCode: 2,
                errMessage: 'Không đăng nhập, refresh token không hợp lệ'
            });
        }

        if (refreshTokenQuery.revoked) {
            return res.status(401).json({
                errCode: 3,
                errMessage: 'Refresh token đã bị thu hồi trước đó'
            });
        }

        if (refreshTokenQuery.expires_at < new Date()) {
            return res.status(401).json({
                errCode: 4,
                errMessage: 'Refresh token đã hết hạn'
            });
        }

        await refreshTokenQuery.update({ revoked: true });

        res.status(200).json({
            errCode: 0,
            message: 'Đăng xuất thành công, refresh token đã bị thu hồi'
        });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId, {
            attributes: ['email', 'display_name', 'role', 'is_verified']
        });

        if (!user) {
            return res.status(404).json({
                errCode: 3,
                errMessage: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            errCode: 0,
            message: 'Lấy thông tin người dùng thành công',
            data: {
                email: user.email,
                display_name: user.display_name,
                role: user.role,
                is_verified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
};
