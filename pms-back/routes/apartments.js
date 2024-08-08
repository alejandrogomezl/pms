// routes/apartments.js
const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment'); // Asegúrate de que esta ruta es correcta

// Ruta GET para obtener todos los apartamentos
router.get('/', async (req, res) => {
  try {
    const apartments = await Apartment.find(); // Asegúrate de que esta función sea válida
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function findApartmentById(id) {
  try {
    const apartment = await Apartment.findById(id);  // Mongoose busca el documento por su ID
    return apartment;
  } catch (error) {
    console.error('Error fetching apartment from DB:', error);
    throw error;  // Lanza el error para manejarlo más adelante
  }
}

router.get('/:id', async (req, res) => {
  try {
    // Simulación de obtener un apartamento por ID
    // En un caso real, aquí iría una consulta a la base de datos
    const apartment = await findApartmentById(req.params.id);
    if (req.params.id) {
      res.json(apartment);
      // res.json({ id: req.params.id, name: "Apartment Name", description: "Description here" });
    } else {
      res.status(404).send('Apartment not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, description, location, price, availability } = req.body;

    // Validar los datos
    if (!name || !description || !location || !price || !availability) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Crear un nuevo documento de apartamento
    const newApartment = new Apartment({
      name,
      description,
      location,
      price,
      availability
    });

    // Guardar el apartamento en la base de datos
    await newApartment.save();
    res.status(201).json({ message: 'Apartment created successfully', apartment: newApartment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar más rutas según sea necesario

module.exports = router;
