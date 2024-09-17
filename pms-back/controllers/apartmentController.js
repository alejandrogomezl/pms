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

    // Encuentra las reservas que se solapan con las fechas proporcionadas (excluyendo el último día de la reserva)
    const conflictingReservations = await Reservation.find({
      $or: [
        // Caso donde las reservas se solapan (excepto el último día)
        {
          $and: [
            { startDate: { $lt: end } }, // La reserva existente empieza antes del final de la nueva reserva
            { endDate: { $gt: start } }, // La reserva existente termina después del inicio de la nueva reserva
          ]
        },
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
