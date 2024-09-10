// models/Apartment.js
const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  services: [String],
  imageUrl: {
    type: String,
    required: true,
  },
  defaultPrice: {
    type: Number, // Precio por defecto si no se establece un precio específico
    default: 100  // Puedes cambiar el valor por defecto si lo prefieres
  }
}, { timestamps: true });

module.exports = mongoose.model('Apartment', ApartmentSchema);