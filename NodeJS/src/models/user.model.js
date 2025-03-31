const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
    'User',
    {
        google_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        display_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('reader', 'author', 'admin'),
            defaultValue: 'reader'
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verification_token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reset_password_token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reset_token_expiry: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

module.exports = User;
