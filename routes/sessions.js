const express = require('express');
const router = express.Router();
const { WorkshopSession } = require('../models');
const { authenticateToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const sessions = await WorkshopSession.findAll({ order: [['session_date', 'DESC']] });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, location, target_group, session_date, participants_count } = req.body;
    const session = await WorkshopSession.create({
      title, location, target_group, session_date, participants_count, coordinator_id: req.user.id
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
