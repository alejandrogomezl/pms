// routes/settings.js
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Obtener la configuración de un servicio
router.get('/:serviceName', async (req, res) => {
  try {
    const settings = await Settings.findOne({ serviceName: req.params.serviceName });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear o actualizar la configuración de un servicio
router.post('/:serviceName', async (req, res) => {
  const { apiUrl, apiKey, token } = req.body;
  
  try {
    let settings = await Settings.findOneAndUpdate(
      { serviceName: req.params.serviceName },
      { apiUrl, apiKey, token },
      { new: true, upsert: true } // 'upsert: true' crea el documento si no existe
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
