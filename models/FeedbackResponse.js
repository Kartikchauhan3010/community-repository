const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeedbackResponse = sequelize.define('FeedbackResponse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  participant_type: { type: DataTypes.STRING, allowNull: false },
  pre_confidence_score: { type: DataTypes.INTEGER, allowNull: false },
  post_confidence_score: { type: DataTypes.INTEGER, allowNull: false },
  fraud_awareness_rating: { type: DataTypes.INTEGER, allowNull: false },
  feedback_notes: { type: DataTypes.TEXT }
});

module.exports = FeedbackResponse;
