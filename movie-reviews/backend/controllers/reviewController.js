// backend/controllers/reviewController.js
const reviewModel = require('../models/reviewModel');

async function createReview(req, res) {
  const { movieId, rating, comment } = req.body;
  const userId = req.user.id;
  if (!movieId || !rating) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }
  try {
    await reviewModel.createReview(userId, movieId, rating, comment || '');
    res.status(201).json({ message: 'Reseña publicada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar reseña', error });
  }
}

async function getReviews(req, res) {
  const { movieId } = req.params;
  try {
    const reviews = await reviewModel.getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error });
  }
}

module.exports = { createReview, getReviews };
