const axios = require('axios');

// Define la URL base de la API
const API_BASE_URL = 'http://localhost:3000/api/reservation-fields';

// Lista de campos que quieres crear
const fields = [
  { name: 'Nombre' },
  { name: 'Apellido' },
  { name: 'Teléfono' },
  { name: 'Dirección' },
  { name: 'País' },
  { name: 'Documento de Identidad' }
];

// Función para crear un campo a través de la API
const createField = async (field) => {
  try {
    const response = await axios.post(API_BASE_URL, field);
    console.log(`Campo creado: ${response.data.name}`);
  } catch (error) {
    console.error(`Error creando el campo ${field.name}:`, error.response?.data || error.message);
  }
};

// Función para generar todos los campos
const generateFields = async () => {
  for (const field of fields) {
    await createField(field); // Crear cada campo secuencialmente
  }
  console.log('Todos los campos han sido creados.');
};

// Ejecuta la función para generar los campos
generateFields();
