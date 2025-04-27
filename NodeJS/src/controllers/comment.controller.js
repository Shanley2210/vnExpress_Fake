const { Comment, Article, User, sequelize } = require('../models');

exports.getCommentsByArticleSlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const article = await Article.findOne({
            where: { slug },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'display_name']
                }
            ]
        });

        if (!article) {
            return res.status(404).json({
                errCode: 1,
                errMessage: 'Không tìm thấy bài viết'
            });
        }

        const comments = await Comment.findAll({
            where: {
                article_id: article.id,
                parent_id: null
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'display_name', 'email', 'role']
                },
                {
                    model: Comment,
                    as: 'replies',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'display_name', 'email', 'role']
                        }
                    ],
                    required: false
                }
            ],
            order: [['created_at', 'ASC']]
        });

        const articleData = {
            id: article.id,
            title: article.title,
            slug: article.slug,
            thumbnail: article.thumbnail,
            author: {
                id: article.author.id,
                display_name: article.author.display_name
            },
            created_at: article.created_at
        };

        const formattedComments = comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            user: {
                id: comment.user.id,
                display_name: comment.user.display_name,
                email: comment.user.email,
                role: comment.user.role
            },
            replies: comment.replies.map((reply) => ({
                id: reply.id,
                content: reply.content,
                created_at: reply.created_at,
                updated_at: reply.updated_at,
                user: {
                    id: reply.user.id,
                    display_name: reply.user.display_name,
                    email: reply.user.email,
                    role: reply.user.role
                },
                replies: []
            }))
        }));

        res.status(200).json({
            errCode: 0,
            message: 'Lấy dữ liệu comment thành công',
            data: {
                article: articleData,
                comments: formattedComments
            }
        });
    } catch (error) {
        console.error('Lỗi lấy comments:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
};

exports.addCommentToArticle = async (req, res) => {
    const { slug } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user.userId;

    try {
        if (!content) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Nội dung bình luận không được để trống'
            });
        }

        const article = await Article.findOne({ where: { slug } });
        if (!article) {
            return res.status(404).json({
                errCode: 2,
                errMessage: 'Không tìm thấy bài viết'
            });
        }

        if (parent_id) {
            const parentComment = await Comment.findOne({
                where: { id: parent_id, article_id: article.id }
            });
            if (!parentComment) {
                return res.status(404).json({
                    errCode: 3,
                    errMessage:
                        'Không tìm thấy bình luận đang trả lời hoặc bình luận đang trả lời không thuộc bài viết này'
                });
            }
        }

        const newComment = await Comment.create({
            content,
            user_id: userId,
            article_id: article.id,
            parent_id: parent_id || null
        });

        const commentWithUser = await Comment.findOne({
            where: { id: newComment.id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'display_name', 'email', 'role']
                }
            ]
        });

        const commentData = {
            id: commentWithUser.id,
            content: commentWithUser.content,
            created_at: commentWithUser.created_at,
            updated_at: commentWithUser.updated_at,
            user: {
                id: commentWithUser.user.id,
                display_name: commentWithUser.user.display_name,
                email: commentWithUser.user.email,
                role: commentWithUser.user.role
            },
            article_id: commentWithUser.article_id,
            parent_id: commentWithUser.parent_id
        };

        res.status(201).json({
            errCode: 0,
            message: 'Bình luận đã được thêm thành công',
            data: commentData
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
};

const deleteCommentAndReplies = async (commentId, transaction) => {
    const replies = await Comment.findAll({
        where: { parent_id: commentId },
        transaction
    });

    for (const reply of replies) {
        await deleteCommentAndReplies(reply.id, transaction);
    }

    await Comment.destroy({
        where: { id: commentId },
        transaction
    });
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const comment = await Comment.findOne({
            where: { id }
        });

        if (!comment) {
            return res.status(404).json({
                errCode: 1,
                errMessage: 'Không tìm thấy bình luận'
            });
        }

        if (comment.user_id !== userId && userRole !== 'admin') {
            return res.status(403).json({
                errCode: 2,
                errMessage: 'Bạn không có quyền xóa bình luận này'
            });
        }

        await sequelize.transaction(async (t) => {
            await deleteCommentAndReplies(id, t);
        });

        res.status(200).json({
            errCode: 0,
            message: 'Bình luận và các reply đã được xóa thành công'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi server'
        });
    }
    
};
