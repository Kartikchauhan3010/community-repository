const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizQuestion = sequelize.define('QuizQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scenario_title: { type: DataTypes.STRING, allowNull: false },
  scenario_type: { type: DataTypes.STRING, defaultValue: 'Visual Scenario' },
  image_badge: { type: DataTypes.STRING, defaultValue: '⚠️ Scam Warning' },
  scenario_text: { type: DataTypes.TEXT, allowNull: false },
  option_a: { type: DataTypes.STRING, allowNull: false },
  option_b: { type: DataTypes.STRING, allowNull: false },
  correct_option: { type: DataTypes.STRING, allowNull: false },
  explanation: { type: DataTypes.TEXT, allowNull: false }
});

module.exports = QuizQuestion;
