const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/booking')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rutas
const authRoutes = require('./routes/auth');
const apartmentRoutes = require('./routes/apartments');
const reservationRoutes = require('./routes/reservations');
const settingsRoutes = require('./routes/settings');
const pricesRoutes = require('./routes/prices')
const reservationFieldsRoutes = require('./routes/reservationFields');
const devicesRoutes = require('./routes/devices');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);  // Asegúrate de que esto está configurado
app.use('/api/reservations', reservationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/reservation-fields', reservationFieldsRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});