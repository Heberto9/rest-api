const pool = require('../db');
const CryptoJS = require('crypto-js');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email y password son requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    const hashedInput = CryptoJS.SHA256(
      password + process.env.SECRET_KEY
    ).toString();

    if (hashedInput !== user.password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = CryptoJS.HmacSHA256(
      `${user.id}${user.email}${Date.now()}`,
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en login' });
  }
};

module.exports = { login };