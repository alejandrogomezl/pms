const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, name, password, email, roles } = req.body;

  try {
    // Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      roles: roles || ['user'],
    });

    await newUser.save();
    res.json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Comparamos la contraseña sin modificar con la almacenada (ya hasheada)
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ token: null, message: 'Contraseña inválida' });

    // Generamos el token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al hacer login', error });
  }
});

module.exports = router;
