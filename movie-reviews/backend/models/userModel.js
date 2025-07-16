// backend/models/userModel.js
const pool = require('./db');

async function createUser(username, email, passwordHash) {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );
  return result.insertId;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

module.exports = { createUser, getUserByEmail, getUserById };
