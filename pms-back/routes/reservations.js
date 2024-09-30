// routes/reservations.js
const express = require('express');
const mongoose = require('mongoose');
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

const generateSecretCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

router.post('/', async (req, res) => {
  const { apartmentId, startDate, endDate, firstName, lastName, phoneNumber, dni, platform, price } = req.body;

  // Convertir las fechas de string a objetos Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!apartmentId || !start || !end || !firstName || !lastName || !phoneNumber || !dni) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validar que la plataforma sea válida
  const allowedPlatforms = ['Booking', 'Airbnb', 'Direct', 'Other'];
  if (platform && !allowedPlatforms.includes(platform)) {
    return res.status(400).json({ error: 'Invalid platform' });
  }

  try {
    // Modificar la consulta para permitir reservas en la misma fecha de finalización o inicio de otra reserva
    const overlappingReservation = await Reservation.findOne({
      apartmentId: apartmentId,
      $or: [
        // Caso donde las reservas se solapan (excepto el último día)
        {
          $and: [
            { startDate: { $lt: end } }, // La reserva existente empieza antes del final de la nueva reserva
            { endDate: { $gt: start } }, // La reserva existente termina después del inicio de la nueva reserva
          ]
        },
      ]
    });

    if (overlappingReservation) {
      return res.status(400).json({ error: 'Apartment is already booked for the given dates' });
    }

    const reservationId = await getNextReservationId();
    const secretCode = generateSecretCode();

    // Crear la reserva si no hay solapamiento
    const reservation = new Reservation({
      reservationId,
      apartmentId,
      startDate: start,
      endDate: end,
      firstName,
      lastName,
      phoneNumber,
      dni,
      secretCode,
      platform: platform || 'Direct',
      price
    });
    await reservation.save();
    res.status(201).json({ message: 'Reservation created', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('apartmentId', 'name'); // Asegúrate de que esta función sea válida
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// routes/reservations.js
router.get('/res', async (req, res) => {
  try {
    const { apartmentId, startDate, endDate, page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'desc' } = req.query;

    // Construir la consulta basada en los parámetros de fecha y apartmentId
    const query = {};
    if (apartmentId) {
      query.apartmentId = apartmentId; // Filtrar por apartmentId si está presente
    }

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



router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar la reserva por _id
    const reservation = await Reservation.findById(id).populate('apartmentId', 'name');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Error al obtener la reserva:', error); // Mostrar el error detallado en la consola
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});



router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, startDate, endDate, phoneNumber, dni, platform } = req.body;

  // Verificar si el ID tiene el formato correcto de ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'El ID proporcionado no es válido' });
  }

  // Convertir las fechas de string a objetos Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!firstName || !lastName || !start || !end || !phoneNumber || !dni) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Validar que la plataforma sea válida
  const allowedPlatforms = ['Booking', 'Airbnb', 'Direct', 'Other'];
  if (platform && !allowedPlatforms.includes(platform)) {
    return res.status(400).json({ message: 'Invalid platform' });
  }

  try {
    // Actualizar la reserva basada en el _id
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { firstName, lastName, startDate: start, endDate: end, phoneNumber, dni, platform: platform || 'Direct' },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva actualizada correctamente', reservation: updatedReservation });
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Verificar si el ID tiene el formato correcto de ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'El ID proporcionado no es válido' });
  }

  try {
    // Eliminar la reserva basada en el _id
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});



module.exports = router;
