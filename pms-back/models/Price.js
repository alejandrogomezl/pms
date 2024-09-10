// models/Price.js
const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment', // Relación con el modelo Apartment
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Price', PriceSchema);