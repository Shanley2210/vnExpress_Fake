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
            }
        },
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Articles',
                key: 'id'
            }
        },
        parent_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Comments',
                key: 'id'
            }
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
