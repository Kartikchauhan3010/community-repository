const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const moduleRoutes = require('./routes/modules');
const quizRoutes = require('./routes/quizzes');
const feedbackRoutes = require('./routes/feedback');
const analyzerRoutes = require('./routes/analyzer');
const analyticsRoutes = require('./routes/analytics');
const botRoutes = require('./routes/bot');
const emailRoutes = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/email', emailRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sequelize.sync().then(() => {
  console.log('Database synced successfully.');
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log();
    console.log('====================================================');
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
