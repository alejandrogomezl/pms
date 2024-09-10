// routes/prices.js
const express = require('express');
const router = express.Router();
const { getPriceForDate } = require('../utils/priceUtils');
const Apartment = require('../models/Apartment');
const Price = require('../models/Price');

// Obtener el precio total para un rango de fechas
router.get('/get-prices/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  const { startDate, endDate } = req.query; // Asegúrate de que estas fechas se pasan correctamente en la solicitud

  try {
    // Validar si las fechas fueron proporcionadas
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan startDate o endDate en la solicitud' });
    }

    // Buscar los precios en la base de datos
    const prices = await Price.find({
      apartmentId,
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) }
    });

    res.json({ prices });
  } catch (error) {
    console.error('Error al obtener los precios:', error);
    res.status(500).json({ message: 'Error al obtener los precios' });
  }
});


router.get('/get-total-price/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calcular el número de noches (diferencia en días)
    const diffTime = Math.abs(end - start);
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Cada noche es un día completo

    if (diffNights <= 0) {
      return res.status(400).json({ message: 'Debe haber al menos una noche' });
    }

    let totalPrice = 0;
    let currentDate = start;

    // Iteramos sobre cada noche dentro del rango de fechas
    for (let i = 0; i < diffNights; i++) {
      const priceForNight = await getPriceForDate(apartmentId, currentDate);
      totalPrice += priceForNight;

      // Avanzamos al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({ totalPrice, diffNights });
  } catch (error) {
    console.error('Error al calcular el precio total:', error);
    res.status(500).json({ message: 'Error al calcular el precio total' });
  }
});

// routes/prices.js
router.post('/set-prices/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  const { prices } = req.body;

  try {
    const updatedPrices = [];

    // Procesa los precios para cada rango de fechas
    for (let priceEntry of prices) {
      const { startDate, endDate, price } = priceEntry;

      // Verifica que todos los campos estén presentes
      if (!startDate || !endDate || !price) {
        return res.status(400).json({ message: 'Faltan campos obligatorios en el cuerpo de la solicitud.' });
      }

      const updatedPrice = await Price.findOneAndUpdate(
        { apartmentId, startDate: new Date(startDate), endDate: new Date(endDate) },
        { price },
        { new: true, upsert: true } // Si no existe, lo crea
      );

      if (!updatedPrice) {
        throw new Error('No se pudo actualizar o crear el precio.');
      }

      updatedPrices.push(updatedPrice);
    }

    res.status(201).json({ message: 'Precios actualizados correctamente', prices: updatedPrices });
  } catch (error) {
    console.error('Error al actualizar los precios:', error); // Esto imprime más detalles sobre el error
    res.status(500).json({ message: 'Error al actualizar los precios', error: error.message });
  }
});

module.exports = router;
