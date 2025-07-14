const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');
const { verifyToken, isAdmin } = require('../../middleware/auth.middleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);

// Admin routes
router.post('/register', verifyToken, isAdmin, authController.register);

module.exports = router;
