const { Article, User, Category, Comment } = require('../models'); 

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            include: [
                {
                    model: User,
                    as:'author',
                    attributes: ['id'], 
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id'], 
                }
            ],
            order: [['created_at', 'DESC']] 
        });
        return res.status(200).json(articles);
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.getArticleBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const article = await Article.findOne({
            where: { slug },
            include: [
                {
                    model: User,
                    as: 'author', 
                    attributes: ['id'], 
                },
                {
                    model: Category,
                    as: 'category', 
                    attributes: ['id'], 
                }
            ]
        });

        if (!article) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        return res.status(200).json(article);
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        // Kiểm tra các trường bắt buộc
        if (!req.body.title || !req.body.content || !req.body.author_id || !req.body.category_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu các trường bắt buộc: title, content, author_id, category_id'
            });
        }

        // Tạo slug nếu không được cung cấp
        const slug = req.body.slug || req.body.title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const articleData = {
            title: req.body.title,
            slug: slug,
            content: req.body.content,
            thumbnail: req.body.thumbnail || null,
            author_id: req.body.author_id, // Lấy trực tiếp từ request
            category_id: req.body.category_id
        };

        const newArticle = await Article.create(articleData);

        return res.status(201).json({
            success: true,
            message: 'Bài viết đã được tạo thành công (TEST MODE)',
            data: newArticle
        });

    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo bài viết',
            error: error.message
        });
    }
};



// Xóa bài viết
exports.deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findByPk(id);

        if (!article) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        // Kiểm tra quyền xóa bài viết (chỉ tác giả hoặc admin mới có quyền)
        if (article.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
        }

        await article.destroy();
        return res.status(200).json({ message: 'Bài viết đã được xóa' });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
