const sequelize = require('../config/database');
const User = require('./User');
const WorkshopSession = require('./WorkshopSession');
const Module = require('./Module');
const QuizQuestion = require('./QuizQuestion');
const FeedbackResponse = require('./FeedbackResponse');
const IncidentReport = require('./IncidentReport');

WorkshopSession.belongsTo(User, { as: 'coordinator', foreignKey: 'coordinator_id' });
QuizQuestion.belongsTo(Module, { foreignKey: 'module_id' });
FeedbackResponse.belongsTo(WorkshopSession, { foreignKey: 'session_id' });

module.exports = {
  sequelize,
  User,
  WorkshopSession,
  Module,
  QuizQuestion,
  FeedbackResponse,
  IncidentReport
};
