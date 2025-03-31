const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    RefreshToken,
    sequelize
};
