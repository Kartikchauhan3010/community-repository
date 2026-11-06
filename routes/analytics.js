const express = require('express');
const router = express.Router();
const { IncidentReport } = require('../models');

router.get('/heatmap', async (req, res) => {
  try {
    const incidents = await IncidentReport.findAll({
      order: [['reported_at', 'DESC']]
    });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/report-incident', async (req, res) => {
  try {
    const { title, category, location_name, lat, lng, severity } = req.body;
    const incident = await IncidentReport.create({
      title, category, location_name, lat, lng, severity: severity || 'High'
    });
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
