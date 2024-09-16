// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: Number,
    unique: true,
    required: true
  },
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Apartment'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    required: true
  },
  secretCode: { 
    type: Number,
    required: true
  },
  platform: {
    type: String,
    enum: ['Booking', 'Airbnb', 'Direct'],
    default: 'Direct'
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
