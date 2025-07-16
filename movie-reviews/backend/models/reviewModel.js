// backend/models/reviewModel.js
const pool = require('./db');

async function createReview(userId, movieId, rating, comment) {
  const [result] = await pool.query(
    'INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, movieId, rating, comment]
  );
  return result.insertId;
}

async function getReviewsByMovieId(movieId) {
  const [rows] = await pool.query(
    `SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = ? ORDER BY r.id DESC`,
    [movieId]
  );
  return rows;
}

module.exports = { createReview, getReviewsByMovieId };
