// routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

router.post('/', async (req, res) => {
  const { apartmentId, startDate, endDate, firstName, lastName, phoneNumber, dni } = req.body;

  // Convertir las fechas de string a objetos Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!apartmentId || !start || !end || !firstName || !lastName || !phoneNumber || !dni) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Verificar si hay alguna reserva existente que se solape con las fechas dadas
    const overlappingReservation = await Reservation.findOne({
      apartmentId: apartmentId,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ]
    });

    if (overlappingReservation) {
      return res.status(400).json({ error: 'Apartment is already booked for the given dates' });
    }

    // Crear la reserva si no hay solapamiento
    const reservation = new Reservation({
      apartmentId,
      startDate: start,
      endDate: end,
      firstName,
      lastName,
      phoneNumber,
      dni
    });
    await reservation.save();
    res.status(201).json({ message: 'Reservation created', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find(); // Asegúrate de que esta función sea válida
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;