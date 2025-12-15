// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { protect, protectAdmin } = require('../middleware/authMiddleware');
const {
  analyzeReviews,
  generateCourseDescription,
  suggestSimilarCourses,
  generateBio,
  getPlatformInsights
} = require('../controllers/aiController');

// Routes protégées (requièrent authentification)
router.post('/analyze-reviews/:courseId', protect, analyzeReviews);
router.post('/generate-description', protect, generateCourseDescription);
router.post('/generate-bio', protect, generateBio);

// Route accessible uniquement aux admins
router.get('/platform-insights', protectAdmin, getPlatformInsights);

// Route publique
router.post('/similar-courses/:courseId', suggestSimilarCourses);

module.exports = router;
