// routes/prices.js

const express = require('express');
const router = express.Router();
const Price = require('../models/Price'); // Modelo que contiene los precios

// Obtener precios de un apartamento
router.get('/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  
  try {
    const prices = await Price.find({ apartmentId });
    res.json({ prices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).send('Error del servidor');
  }
});

// Actualizar precio de un día específico
router.post('/update/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  const { date, price } = req.body;

  try {
    const priceEntry = await Price.findOneAndUpdate(
      { apartmentId, date: new Date(date) },
      { price },
      { new: true, upsert: true } // Si no existe, lo crea
    );
    res.json({ priceEntry });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
