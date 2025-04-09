const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user.model');
const Article = require('./article.model');
const Comment = require('./comment.model');
const Category = require('./category.model');
const RefreshToken = require('./refreshToken.model');

User.hasMany(Comment, {
    foreignKey: 'user_id',
    as: 'comments',
    onDelete: 'CASCADE'
});
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Article.hasMany(Comment, {
    foreignKey: 'article_id',
    as: 'comments',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

Comment.hasMany(Comment, {
    foreignKey: 'parent_id',
    as: 'replies',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });

User.hasMany(Article, {
    foreignKey: 'author_id',
    as: 'articles',
    onDelete: 'CASCADE'
});
Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });
Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

User.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Category, {
    as: 'children',
    foreignKey: 'parent_id',
    constraints: false
});
Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parent_id',
    constraints: false
});

module.exports = {
    User,
    Article,
    Comment,
    Category,
    RefreshToken,
    sequelize
};
