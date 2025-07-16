// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  try {
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(username, email, hash);
    res.status(201).json({ message: 'Usuario registrado', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
}

module.exports = { register, login };
