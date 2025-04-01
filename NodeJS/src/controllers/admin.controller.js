const { Article, Comment, User } = require('../models');

// Lấy tất cả bài viết (kể cả draft)
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.findAll();
        res.json({ articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'email']
                },
                {
                    model: Comment,
                    as: 'replies', 
                    include: {
                        model: User,
                        attributes: ['id', 'email']
                    }
                },
                {
                    model: Article,
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

