const express = require('express');
const router = express.Router();
const ReservationField = require('../models/ReservationField');

// Obtener todos los campos de reserva
router.get('/', async (req, res) => {
  try {
    const fields = await ReservationField.find();
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservation fields', error });
  }
});

// Crear un nuevo campo de reserva
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Field name is required' });
  }

  try {
    const newField = new ReservationField({ name });
    await newField.save();
    res.status(201).json(newField);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation field', error });
  }
});

// Actualizar un campo de reserva
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Field name is required' });
  }

  try {
    const updatedField = await ReservationField.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedField) {
      return res.status(404).json({ message: 'Field not found' });
    }
    res.json(updatedField);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation field', error });
  }
});

// Eliminar un campo de reserva
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedField = await ReservationField.findByIdAndDelete(id);
    if (!deletedField) {
      return res.status(404).json({ message: 'Field not found' });
    }
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation field', error });
  }
});

module.exports = router;
