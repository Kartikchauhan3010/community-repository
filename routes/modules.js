const express = require('express');
const router = express.Router();
const { Module } = require('../models');

router.get('/', async (req, res) => {
  try {
    const modules = await Module.findAll();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mod = await Module.findByPk(req.params.id);
    if (!mod) return res.status(404).json({ error: 'Module not found' });
    res.json(mod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
