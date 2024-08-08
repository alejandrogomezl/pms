// models/Apartment.js
const mongoose = require('mongoose');

// Definir el esquema para Apartment
const ApartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: [Date], required: true }
});

// Exportar el modelo
module.exports = mongoose.model('Apartment', ApartmentSchema);
