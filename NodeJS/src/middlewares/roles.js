const { User } = require('../models');

const authorizeRoleByUserId = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { user_id } = req.body; // Nhận user_id từ body request

            if (!user_id) {
                return res.status(400).json({ message: 'Thiếu user_id' });
            }

            // Tìm user theo user_id
            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(404).json({ message: 'User không tồn tại' });
            }

            // Kiểm tra quyền truy cập
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
            }

            // Gán user vào request để các middleware tiếp theo có thể dùng
            req.user = user;
            next();
        } catch (err) {
            return res.status(500).json({ message: 'Lỗi server', error: err.message });
        }
    };
};

module.exports = authorizeRoleByUserId;
