const { Article, Comment, User } = require('../models');

// Lấy tất cả bài viết (kể cả draft)
exports.getAllArticles = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const articles = await Article.findAll();
        res.json({ articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        // Kiểm tra xác thực từ token
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email']
                },
                {
                    model: Comment,
                    as: 'replies', 
                    include: {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email']
                    }
                },
                {
                    model: Article,
                    as: 'article',
                    attributes: ['id']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bình luận" });
    }
};

