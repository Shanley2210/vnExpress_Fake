const { User, Comment, RefreshToken, Article } = require('../models');

/*Get All User*/
exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const users = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            limit,
            offset
        });

        res.json({
            totalUsers: users.count,
            totalPages: Math.ceil(users.count / limit),
            currentPage: page,
            users: users.rows
        });
    } catch (error) {
        next(error);
    }
};

/*Get User By Id*/
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        res.json(user);
    } catch (error) {
        next(error);
    }
};

/*Update Role*/
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const validRoles = ['reader', 'author', 'admin'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        await user.update({ role });

        res.json({ message: 'Cập nhật vai trò thành công', user });
    } catch (error) {
        next(error);
    }
};

/*Delete User*/
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        // Xóa refresh tokens của user trước
        await RefreshToken.destroy({ where: { user_id: req.params.id } });

        // Xóa tất cả comment của user
        await Comment.destroy({ where: { user_id: req.params.id } });

        // Nếu user là author, xóa tất cả bài viết của họ
        if (user.role === 'author') {
            await Article.destroy({ where: { user_id: req.params.id } });
        }

        // Cuối cùng, xóa user
        await user.destroy();

        res.json({ message: 'User và dữ liệu liên quan đã bị xóa thành công' });
    } catch (error) {
        console.error('Error during user deletion:', error);
        next(error);
    }
};

