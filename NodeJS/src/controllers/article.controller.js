const { Article, User, Category, Comment } = require('../models'); 
const authenticationToken  = require('../middlewares/authenticateToken');
const slugify = require('slugify');

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
        const user = req.user;

        if (!user) {
            return res.status(403).json({
                errCode: 1,
                errMessage: 'Bạn cần đăng nhập để tạo bài viết'
            });
        }

        if (user.role !== 'author' && user.role !== 'admin') {
            return res.status(403).json({
                errCode: 2,
                errMessage: 'Bạn không có quyền tạo bài viết'
            });
        }

        console.log("User from token:", req.user); 

        const { title, content, category_id } = req.body;

        if (!title || !content || !category_id) {
            return res.status(400).json({
                errCode: 3,
                errMessage: 'Tiêu đề, nội dung và danh mục không được để trống'
            });
        }

        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

        const newArticle = await Article.create({
            title,
            slug,
            content,
            category_id,  
            author_id: user.userId  
        });

        return res.status(201).json({
            errCode: 0,
            errMessage: 'Tạo bài viết thành công',
            data: newArticle
        });
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        return res.status(500).json({
            errCode: 4,
            errMessage: 'Lỗi server, không thể tạo bài viết'
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

        if (article.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
        }

        await article.destroy();
        return res.status(200).json({ message: 'Bài viết đã được xóa' });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
