// routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Counter = require('../models/Counter');

const getNextReservationId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: 'reservationId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // 'upsert' crea el documento si no existe
  );

  if (!counter) {
    throw new Error('Error creating or accessing the counter for reservationId');
  }

  return counter.seq;
};

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

    const reservationId = await getNextReservationId();

    // Crear la reserva si no hay solapamiento
    const reservation = new Reservation({
      reservationId,
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


// routes/reservations.js
router.get('/res', async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'desc' } = req.query;

    // Construir la consulta basada en los parámetros de fecha
    const query = {};
    if (startDate && !endDate) {
      query.startDate = { $gte: new Date(startDate) };
    } else if (!startDate && endDate) {
      query.endDate = { $lte: new Date(endDate) };
    } else if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    // Contar el número total de reservas que coinciden con la consulta
    const totalReservations = await Reservation.countDocuments(query);

    // Ordenar por el campo especificado y en la dirección especificada
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Obtener las reservas paginadas
    const reservations = await Reservation.find(query)
      .populate('apartmentId', 'name')
      .sort(sortOptions)
      .skip((page - 1) * limit) // Salta las reservas para la paginación
      .limit(parseInt(limit));  // Limita el número de resultados

    // Devolver las reservas y el número total de reservas
    res.json({ reservations, totalReservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).send('Error del servidor');
  }
});


router.get('/res/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const { startDate, endDate, page = 1, limit = 10, sortField = 'startDate', sortDirection = 'asc' } = req.query;

    const query = { apartmentId };
    
    // Condicionales para manejar la existencia de solo una fecha
    if (startDate && !endDate) {
      query.startDate = { $gte: new Date(startDate) };
    } else if (!startDate && endDate) {
      query.endDate = { $lte: new Date(endDate) };
    } else if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    const totalReservations = await Reservation.countDocuments(query);

    // Construir el objeto de ordenación
    const sortOptions = {};
    sortOptions[sortField] = sortDirection === 'asc' ? 1 : -1;

    // Obtener las reservas paginadas y ordenadas
    const reservations = await Reservation.find(query)
      .populate('apartmentId', 'name')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Devolver las reservas y el número total de reservas
    res.json({ reservations, totalReservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).send('Error del servidor');
  }
});





module.exports = router;
