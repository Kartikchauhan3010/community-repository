const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Module = sequelize.define('Module', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  icon: { type: DataTypes.STRING, defaultValue: 'shield-alert' },
  key_takeaways: { type: DataTypes.JSON, defaultValue: [] }
});

module.exports = Module;
