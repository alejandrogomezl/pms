// controllers/apartmentController.js
const Apartment = require('../models/Apartment');
const Reservation = require('../models/Reservation');

const getAvailableApartments = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Por favor, proporcione fechas de inicio y fin.' });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Encuentra las reservas que se solapan con las fechas proporcionadas
    const conflictingReservations = await Reservation.find({
      $or: [
        { startDate: { $lte: end, $gte: start } }, // Reservas que empiezan dentro del rango dado
        { endDate: { $gte: start, $lte: end } },   // Reservas que terminan dentro del rango dado
        { startDate: { $lte: start }, endDate: { $gte: end } } // Reservas que cubren todo el rango
      ]
    }).select('apartmentId'); // Solo seleccionamos los IDs de los apartamentos en conflicto

    const reservedApartmentIds = conflictingReservations.map(reservation => reservation.apartmentId);

    // Encuentra los apartamentos que NO están en los IDs reservados
    const availableApartments = await Apartment.find({
      _id: { $nin: reservedApartmentIds }
    });

    res.json(availableApartments);
  } catch (error) {
    console.error('Error al obtener los apartamentos disponibles:', error);
    res.status(500).json({ message: 'Error al obtener los apartamentos disponibles.' });
  }
};

module.exports = {
  getAvailableApartments,
};
