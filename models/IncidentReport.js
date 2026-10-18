const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IncidentReport = sequelize.define('IncidentReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  location_name: { type: DataTypes.STRING, allowNull: false },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  severity: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), defaultValue: 'High' },
  status: { type: DataTypes.STRING, defaultValue: 'Active Trend' },
  reported_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = IncidentReport;
