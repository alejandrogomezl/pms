const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Counter = require('../models/Counter');

// Middleware para validar ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'El ID proporcionado no es válido' });
  }
  next();
};

// Función centralizada para manejar errores
const handleErrors = (res, error, message = 'Error del servidor') => {
  console.error(message, error);
  return res.status(500).json({ message, error: error.message });
};

// Generar nuevo ID de reserva
const getNextReservationId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: 'reservationId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!counter) throw new Error('Error creando o accediendo al contador de reservationId');
  return counter.seq;
};

// Generar código secreto
const generateSecretCode = () => Math.floor(100000 + Math.random() * 900000);

// Crear o actualizar reserva
const createOrUpdateReservation = async (req, res, isUpdate = false) => {
  const { apartmentId, startDate, endDate, firstName, lastName, phoneNumber, dni, platform = 'Direct', price } = req.body;
  const { id } = req.params; // Solo para update

  const start = new Date(startDate);
  const end = new Date(endDate);
  const allowedPlatforms = ['Booking', 'Airbnb', 'Direct', 'Other'];

  if (!apartmentId || !start || !end || !firstName || !lastName || !phoneNumber || !dni || (platform && !allowedPlatforms.includes(platform))) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const overlappingReservation = await Reservation.findOne({
      apartmentId,
      $or: [
        { $and: [{ startDate: { $lt: end } }, { endDate: { $gt: start } }] },
      ],
      ...(isUpdate && { _id: { $ne: id } }), // Excluir la reserva actual al editar
    });

    if (overlappingReservation) {
      return res.status(400).json({ error: 'Apartamento ya reservado para las fechas seleccionadas' });
    }

    if (isUpdate) {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        id,
        { apartmentId, startDate: start, endDate: end, firstName, lastName, phoneNumber, dni, platform, price },
        { new: true }
      );
      return res.json({ message: 'Reserva actualizada correctamente', reservation: updatedReservation });
    } else {
      const reservationId = await getNextReservationId();
      const secretCode = generateSecretCode();
      const reservation = new Reservation({
        reservationId,
        apartmentId,
        startDate: start,
        endDate: end,
        firstName,
        lastName,
        phoneNumber,
        dni,
        platform,
        secretCode,
        price,
      });
      await reservation.save();
      return res.status(201).json({ message: 'Reserva creada correctamente', reservation });
    }
  } catch (error) {
    return handleErrors(res, error, 'Error creando o actualizando la reserva');
  }
};

// Ruta para crear una reserva
router.post('/', (req, res) => createOrUpdateReservation(req, res));

// Ruta para actualizar una reserva
router.put('/:id', validateObjectId, (req, res) => createOrUpdateReservation(req, res, true));

// Obtener todas las reservas o buscar por fechas y apartmentId
router.get('/', async (req, res) => {
  try {
    const { apartmentId, startDate, endDate, page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'desc' } = req.query;
    const query = { ...(apartmentId && { apartmentId }) };

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    } else if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }

    const totalReservations = await Reservation.countDocuments(query);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const reservations = await Reservation.find(query)
      .populate('apartmentId', 'name')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ reservations, totalReservations });
  } catch (error) {
    handleErrors(res, error, 'Error obteniendo reservas');
  }
});

// Obtener reserva por ID
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('apartmentId', 'name');
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(reservation);
  } catch (error) {
    handleErrors(res, error, 'Error obteniendo reserva');
  }
});

// Eliminar reserva
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    handleErrors(res, error, 'Error eliminando reserva');
  }
});

module.exports = router;