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

router.get('/res', async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Construir la consulta basada en los parámetros de fecha
    const query = {};
    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    // Contar el número total de reservas que coinciden con la consulta
    const totalReservations = await Reservation.countDocuments(query);

    // Obtener las reservas paginadas
    const reservations = await Reservation.find(query)
      .sort({ startDate: -1 }) // Ordena por la fecha de inicio, la más reciente primero
      .skip((page - 1) * limit) // Salta las reservas para la paginación
      .limit(parseInt(limit));  // Limita el número de resultados

    // Devolver las reservas y el número total de reservas
    res.json({ reservations, totalReservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).send('Error del servidor');
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
