const { User, Comment, RefreshToken, Article } = require('../models');

/*Get All User*/
exports.getAllUsers = async (req, res, next) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xem danh sách người dùng' });
        }

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
        const currentUser = req.user;
        const userId = req.params.id;

        if (currentUser.id !== parseInt(userId) && currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xem thông tin người dùng này' });
        }

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        res.json(user);
    } catch (error) {
        next(error);
    }
};


/*Update Role*/
// Update User Role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const currentUser = req.user;

        const validRoles = ['reader', 'author', 'admin'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật vai trò người dùng' });
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
    const currentUser = req.user; 

    try {
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng này' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        await RefreshToken.destroy({ where: { user_id: userId } });
        await Comment.destroy({ where: { user_id: userId } });
        await Article.destroy({ where: { author_id: userId } });
        await user.destroy();

        return res.json({ message: 'Người dùng và dữ liệu liên quan đã bị xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        return res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
    }
};


