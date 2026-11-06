const express = require('express');
const router = express.Router();
const { QuizQuestion } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { module_id } = req.query;
    const where = module_id ? { module_id } : {};
    const questions = await QuizQuestion.findAll({ where });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body; // [{ question_id: 1, selected_option: 'option_a' }]
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    let score = 0;
    const results = [];

    for (const ans of answers) {
      const q = await QuizQuestion.findByPk(ans.question_id);
      if (q) {
        const isCorrect = ans.selected_option === q.correct_option;
        if (isCorrect) score++;
        results.push({
          question_id: q.id,
          scenario_title: q.scenario_title,
          isCorrect,
          correct_option: q.correct_option,
          explanation: q.explanation
        });
      }
    }

    res.json({
      total: answers.length,
      score,
      percentage: Math.round((score / (answers.length || 1)) * 100),
      results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
