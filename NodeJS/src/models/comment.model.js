const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define(
    'Comment',
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE', // 👈 Thêm dòng này
            onUpdate: 'CASCADE'
        },
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Articles',
                key: 'id'
            },
            onDelete: 'CASCADE', // 👈 Thêm dòng này
            onUpdate: 'CASCADE'
        },
        parent_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Comments',
                key: 'id'
            },
            onDelete: 'CASCADE', // 👈 Thêm dòng này
            onUpdate: 'CASCADE'
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'comments'
    }
);

module.exports = Comment;
