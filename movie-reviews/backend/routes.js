// backend/routes.js
const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const reviewController = require('./controllers/reviewController');
const authenticateToken = require('./middleware/auth');

// Registro y login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Reseñas
router.post('/reviews', authenticateToken, reviewController.createReview);
router.get('/reviews/:movieId', reviewController.getReviews);

module.exports = router;
