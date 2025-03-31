const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');
const Comment = require('./comment.model');
const Category = require('./category.model');
const Article = require('./article.model');

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Article.hasMany(Comment, { foreignKey: 'article_id', as: 'comments' });
Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parent_id' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parent_id' });

Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });
Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

module.exports = {
    User,
    RefreshToken,
    Comment,
    Category,
    Article,
    sequelize
};
