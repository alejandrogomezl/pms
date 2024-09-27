const axios = require('axios');
const { faker } = require('@faker-js/faker');

// Mapa para almacenar las fechas ocupadas por cada apartamento
const apartmentReservations = {};

// Función para obtener los IDs de los apartamentos existentes a través de la API
const fetchApartmentIds = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/apartments/all');
    const apartments = response.data;

    // Extraer los IDs de los apartamentos
    return apartments.map(apartment => apartment._id);
  } catch (error) {
    console.error('Error fetching apartment IDs:', error.message);
    return [];
  }
};

// Función para obtener las reservas existentes de la API
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

// Función para generar una reserva aleatoria, evitando solapamientos
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
    dni: faker.string.alphanumeric(8),                      // Documento de identidad
    price: faker.number.float({ min: 50, max: 2000, precision: 0.01 })  // Precio de la reserva
  };
};

// Función para crear una reserva a través de la API
const createReservation = async (reservation) => {
  try {
    const response = await axios.post('http://localhost:3000/api/reservations', reservation);
    console.log('Reserva creada:', response.data);
  } catch (error) {
    console.error('Error creando la reserva:', error.response ? error.response.data : error.message);
  }
};

// Función para generar las reservas
const generateReservations = async (numReservations) => {
  try {
    // Primero obtenemos los IDs de los apartamentos existentes
    const apartmentIds = await fetchApartmentIds();
    if (apartmentIds.length === 0) {
      console.error('No se encontraron apartamentos.');
      return;
    }

    // Luego obtenemos las reservas existentes
    await fetchExistingReservations();

    // Generamos las nuevas reservas, asegurándonos de evitar solapamientos
    for (let i = 0; i < numReservations; i++) {
      const apartmentId = faker.helpers.arrayElement(apartmentIds);
      const reservation = generateRandomReservation(apartmentId);
      await createReservation(reservation);
    }

    console.log(`${numReservations} reservas creadas exitosamente.`);
  } catch (error) {
    console.error('Error al generar las reservas:', error.message);
  }
};

// Ejecuta la función para crear las reservas
generateReservations(1000);