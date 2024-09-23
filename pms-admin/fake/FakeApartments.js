const axios = require('axios');
const { faker } = require('@faker-js/faker');

// URL base de la API (modifica la URL según tu entorno)
const API_URL = 'http://localhost:3000/api/apartments';

// Función para generar datos aleatorios de un apartamento
const generateRandomApartment = () => ({
  name: faker.address.streetName() + ' Apartment',
  description: faker.lorem.sentence(),
  price: faker.datatype.number({ min: 100, max: 500 }), // Precio entre 100 y 500
  imageUrl: faker.image.city(640, 480, true), // Imagen de ciudad aleatoria
  services: faker.helpers
    .arrayElements(['Wifi', 'TV', 'Lavadora', 'Piscina', 'Gimnasio', 'Jacuzzi'], faker.datatype.number({ min: 1, max: 4 }))
    .join(', '), // Convertir el array en string separado por comas
  defaultPrice: faker.datatype.number({ min: 100, max: 600 }), // Precio por defecto entre 100 y 600
});

// Función para crear un apartamento mediante la API
const createApartmentViaAPI = async (apartment) => {
  try {
    const response = await axios.post(API_URL, apartment);
    console.log('Apartamento creado:', response.data);
  } catch (error) {
    console.error('Error al crear el apartamento:', error.response ? error.response.data : error.message);
  }
};

// Función para crear 20 apartamentos
const createApartments = async (count = 100) => {
  const apartments = Array.from({ length: count }, () => generateRandomApartment());
  
  for (const apartment of apartments) {
    console.log(apartment);
    await createApartmentViaAPI(apartment); // Crear cada apartamento vía API
  }

  console.log(`${count} apartamentos creados exitosamente.`);
};

// Ejecuta la función para crear los apartamentos
createApartments();
