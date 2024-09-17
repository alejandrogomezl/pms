const axios = require('axios');
const { faker } = require('@faker-js/faker');

// Asumimos que tienes IDs válidos de apartamentos disponibles
const apartmentIds = [
  '66b28fa5788b6539eddadf41', // Reemplaza estos con IDs reales de tu base de datos
  '66b40bb1795418e57ed1af16',
  '66d1b0d0830e0d5154381fd3'
];

// Mapa para almacenar las fechas ocupadas por cada apartamento
const apartmentReservations = {};

const fetchExistingReservations = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/reservations');
    const reservations = response.data;
    
    // Agrupar reservas por apartmentId
    reservations.forEach(reservation => {
      if (!apartmentReservations[reservation.apartmentId]) {
        apartmentReservations[reservation.apartmentId] = [];
      }
      apartmentReservations[reservation.apartmentId].push({
        startDate: new Date(reservation.startDate),
        endDate: new Date(reservation.endDate)
      });
    });
  } catch (error) {
    console.error('Error fetching existing reservations:', error.message);
  }
};

const generateRandomReservation = (apartmentId) => {
  let startDate, endDate;
  let isOverlapping;

  do {
    // Generar fechas aleatorias
    startDate = faker.date.between({ from: '2024-08-01', to: '2025-09-30' });
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + faker.number.int({ min: 1, max: 7 }));

    isOverlapping = false;

    // Verificar solapamiento con reservas existentes
    if (apartmentReservations[apartmentId]) {
      isOverlapping = apartmentReservations[apartmentId].some(reservation => {
        const reservedStart = new Date(reservation.startDate);
        const reservedEnd = new Date(reservation.endDate);
        return (startDate <= reservedEnd && endDate >= reservedStart);
      });
    }
  } while (isOverlapping);

  // Guardar las fechas para evitar futuros solapamientos
  if (!apartmentReservations[apartmentId]) {
    apartmentReservations[apartmentId] = [];
  }
  apartmentReservations[apartmentId].push({ startDate, endDate });

  return {
    apartmentId,
    startDate: startDate.toISOString().split('T')[0],      // Fecha de inicio de la reserva
    endDate: endDate.toISOString().split('T')[0],          // Fecha de fin de la reserva
    firstName: faker.person.firstName(),                   // Nombre del cliente
    lastName: faker.person.lastName(),                     // Apellido del cliente
    phoneNumber: faker.phone.number(),                     // Número de teléfono
    dni: faker.string.alphanumeric(8)                      // Documento de identidad
  };
};

const createReservation = async (reservation) => {
  try {
    const response = await axios.post('http://localhost:3000/api/reservations', reservation);
    console.log('Reserva creada:', response.data);
  } catch (error) {
    console.error('Error creando la reserva:', error.response ? error.response.data : error.message);
  }
};

const generateReservations = async (numReservations) => {
  // Primero obtenemos las reservas existentes
  await fetchExistingReservations();

  // Luego generamos las nuevas reservas, asegurándonos de evitar solapamientos
  for (let i = 0; i < numReservations; i++) {
    const apartmentId = faker.helpers.arrayElement(apartmentIds);
    const reservation = generateRandomReservation(apartmentId);
    await createReservation(reservation);
  }
};

generateReservations(30);