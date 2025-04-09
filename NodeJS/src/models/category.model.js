const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define(
    'Category',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'categories'
    }
);

module.exports = Category;
