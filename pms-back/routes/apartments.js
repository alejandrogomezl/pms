// routes/apartments.js
const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment'); // Asegúrate de que esta ruta es correcta

const { getAvailableApartments } = require('../controllers/apartmentController');

// routes/apartments.js
router.post('/', async (req, res) => {
  try {
    const { name, description, price, services, imageUrl } = req.body;

    // Validar los datos
    if (!name || !description || !price || !services || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Crear un nuevo documento de apartamento
    const newApartment = new Apartment({
      name,
      description,
      price,
      services: services.split(','), // Asegúrate de que los servicios se almacenen como un array
      imageUrl
    });

    // Guardar el apartamento en la base de datos
    await newApartment.save();
    res.status(201).json({ message: 'Apartment created successfully', apartment: newApartment });
  } catch (error) {
    console.error('Error creating apartment:', error); // Log del error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/', getAvailableApartments);

// Ruta GET para obtener todos los apartamentos
router.get('/all', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, services, imageUrl } = req.body;

  try {
    const updatedApartment = await Apartment.findByIdAndUpdate(
      id,
      { name, description, price, services, imageUrl },
      { new: true }
    );

    if (!updatedApartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    res.json({ message: 'Apartment updated successfully', apartment: updatedApartment });
  } catch (error) {
    console.error('Error updating apartment:', error);
    res.status(500).json({ message: 'Error updating apartment' });
  }
});


// router.post('/', async (req, res) => {
//   try {
//     const { name, description, location, price, availability } = req.body;

//     // Validar los datos
//     if (!name || !description || !location || !price || !availability) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Crear un nuevo documento de apartamento
//     const newApartment = new Apartment({
//       name,
//       description,
//       location,
//       price,
//       availability
//     });

//     // Guardar el apartamento en la base de datos
//     await newApartment.save();
//     res.status(201).json({ message: 'Apartment created successfully', apartment: newApartment });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Agregar más rutas según sea necesario

// routes/apartments.js

module.exports = router;
