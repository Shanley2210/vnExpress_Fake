const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Article = sequelize.define(
    'Article',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        thumbnail: DataTypes.STRING,
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE', // 👈 thêm dòng này
            onUpdate: 'CASCADE'
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            },
            onDelete: 'CASCADE', // 👈 thêm dòng này
            onUpdate: 'CASCADE'
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'articles'
    }
);

module.exports = Article;
