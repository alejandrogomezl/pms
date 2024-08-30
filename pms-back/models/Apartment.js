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
  price: {
    type: Number,
    required: true,
  },
  services: {
    type: [String], // Asegúrate de que se espera un array
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

const Apartment = mongoose.model('Apartment', ApartmentSchema);
module.exports = Apartment;