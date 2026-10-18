const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkshopSession = sequelize.define('WorkshopSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  target_group: { type: DataTypes.STRING, allowNull: false },
  session_date: { type: DataTypes.DATEONLY, allowNull: false },
  participants_count: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = WorkshopSession;
