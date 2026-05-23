const pool = require('../db');
const crypto = require('crypto');
require('dotenv').config();

const hashPassword = (password, salt) => {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, created_at FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, nombre, email, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

const createUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'nombre, email y password son requeridos' });
  }
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);
    const result = await pool.query(
      'INSERT INTO users (nombre, email, password, salt) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, created_at',
      [nombre, email, hashedPassword, salt]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET nombre = COALESCE($1, nombre), email = COALESCE($2, email) WHERE id = $3 RETURNING id, nombre, email',
      [nombre, email, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, nombre, email', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };