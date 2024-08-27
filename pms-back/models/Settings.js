// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, unique: true }, // 'SmartLock', 'AirBnB', 'Booking'
  apiUrl: { type: String, required: true },
  apiKey: { type: String, required: true },
  token: { type: String, required: true }
});

module.exports = mongoose.model('Settings', settingsSchema);