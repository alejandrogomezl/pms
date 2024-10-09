const express = require('express');
const router = express.Router();

// Ruta para obtener detalles del administrador
router.get('/dashboard', (req, res) => {
  res.send('Bienvenido al panel de administración');
});

// Otras rutas de admin

module.exports = router;
