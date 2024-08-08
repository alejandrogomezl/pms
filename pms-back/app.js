const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);  // Asegúrate de que esto está configurado
app.use('/api/reservations', reservationRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});