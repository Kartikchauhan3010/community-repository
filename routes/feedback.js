const express = require('express');
const router = express.Router();
const { FeedbackResponse, WorkshopSession } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { session_id, participant_type, pre_confidence_score, post_confidence_score, fraud_awareness_rating, feedback_notes } = req.body;
    const feedback = await FeedbackResponse.create({
      session_id: session_id || null,
      participant_type,
      pre_confidence_score,
      post_confidence_score,
      fraud_awareness_rating,
      feedback_notes
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/metrics', async (req, res) => {
  try {
    const responses = await FeedbackResponse.findAll();
    const total = responses.length;

    let totalPre = 0;
    let totalPost = 0;
    let totalRating = 0;

    responses.forEach(r => {
      totalPre += r.pre_confidence_score;
      totalPost += r.post_confidence_score;
      totalRating += r.fraud_awareness_rating;
    });

    const avgPre = total ? (totalPre / total).toFixed(1) : 0;
    const avgPost = total ? (totalPost / total).toFixed(1) : 0;
    const avgRating = total ? (totalRating / total).toFixed(1) : 0;
    const impactGrowth = avgPre > 0 ? (((avgPost - avgPre) / avgPre) * 100).toFixed(1) : 0;

    res.json({
      total_participants_evaluated: total,
      avg_pre_confidence: parseFloat(avgPre),
      avg_post_confidence: parseFloat(avgPost),
      avg_awareness_rating: parseFloat(avgRating),
      impact_growth_percentage: parseFloat(impactGrowth)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
