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
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user;  // Người dùng hiện tại từ token

    try {
        // Kiểm tra nếu người dùng hiện tại có quyền xóa
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng này' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Xóa refresh tokens của user
        await RefreshToken.destroy({ where: { user_id: userId } });

        // Xóa tất cả comment của user
        await Comment.destroy({ where: { user_id: userId } });

        // Nếu user là author, xóa tất cả bài viết của họ
        await Article.destroy({ where: { author_id: userId } });

        // Cuối cùng, xóa user
        await user.destroy();

        return res.json({ message: 'Người dùng và dữ liệu liên quan đã bị xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        return res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
    }
};


