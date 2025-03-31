const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            errCode: 1,
            errMessage: 'Không có Access token'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                errCode: 2,
                errMessage: 'Access token không hợp lệ hoặc đã hết hạn'
            });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
