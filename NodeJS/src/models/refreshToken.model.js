const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RefreshToken = sequelize.define(
    'RefreshToken',
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        revoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'refresh_tokens',
        timestamps: false
    }
);

module.exports = RefreshToken;
