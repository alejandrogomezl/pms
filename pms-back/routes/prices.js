// routes/prices.js
const express = require('express');
const router = express.Router();
const { getPriceForDate } = require('../utils/priceUtils');
const Apartment = require('../models/Apartment');
const Price = require('../models/Price');

// Obtener el precio total para un rango de fechas
router.get('/get-prices/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;
  const { startDate, endDate, mode = 'detailed' } = req.query;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan startDate o endDate en la solicitud' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffNights <= 0) {
      return res.status(400).json({ message: 'Debe haber al menos una noche' });
    }

    // Modo para calcular precio total
    if (mode === 'total') {
      let totalPrice = 0;
      let currentDate = start;

      for (let i = 0; i < diffNights; i++) {
        const priceForNight = await getPriceForDate(apartmentId, currentDate);
        totalPrice += priceForNight;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return res.json({ totalPrice, diffNights });
    }

    // Modo para obtener precios detallados por cada día
    if (mode === 'detailed') {
      const prices = await Price.find({
        apartmentId,
        startDate: { $gte: new Date(startDate) },
        endDate: { $lte: new Date(endDate) }
      });

      return res.json({ prices });
    }

    // Si el modo no es válido
    return res.status(400).json({ message: 'Modo no válido. Usa "detailed" o "total"' });

  } catch (error) {
    console.error('Error en la ruta de precios:', error);
    res.status(500).json({ message: 'Error al obtener los precios' });
  }
});


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

// Eliminar un precio específico
router.delete('/delete-price/:apartmentId/:priceId', async (req, res) => {
  const { apartmentId, priceId } = req.params;

  try {
    // Eliminar el precio de la base de datos
    const deletedPrice = await Price.findOneAndDelete({ _id: priceId, apartmentId });

    if (!deletedPrice) {
      return res.status(404).json({ message: 'Precio no encontrado' });
    }

    res.json({ message: 'Precio eliminado correctamente', price: deletedPrice });
  } catch (error) {
    console.error('Error al eliminar el precio:', error);
    res.status(500).json({ message: 'Error al eliminar el precio' });
  }
});


// Editar un precio específico
router.put('/update-price/:apartmentId/:priceId', async (req, res) => {
  const { apartmentId, priceId } = req.params;
  const { startDate, endDate, price } = req.body;

  console.log('Price ID:', priceId);
  console.log('Apartment ID:', apartmentId);
  console.log('Body recibido:', req.body);  // Verifica que el cuerpo de la solicitud tiene los datos correctos

  try {
    if (!startDate || !endDate || !price) {
      return res.status(400).json({ message: 'Faltan campos obligatorios en el cuerpo de la solicitud.' });
    }

    const updatedPrice = await Price.findOneAndUpdate(
      { _id: priceId, apartmentId },  // Asegúrate de que el ID del precio y el ID del apartamento sean correctos
      { startDate: new Date(startDate), endDate: new Date(endDate), price },
      { new: true }
    );

    if (!updatedPrice) {
      return res.status(404).json({ message: 'Precio no encontrado' });
    }

    res.json({ message: 'Precio actualizado correctamente', price: updatedPrice });
  } catch (error) {
    console.error('Error al actualizar el precio:', error);
    res.status(500).json({ message: 'Error al actualizar el precio' });
  }
});
