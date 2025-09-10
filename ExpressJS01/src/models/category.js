const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const sequelize = connection.sequelize;

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;
