const mongoose = require('mongoose');

const ReservationFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }
});

module.exports = mongoose.model('ReservationField', ReservationFieldSchema);
