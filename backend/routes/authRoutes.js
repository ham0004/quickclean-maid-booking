const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { resendVerificationLimiter } = require('../middleware/rateLimitMiddleware');
const {
    register,
    login,
    verifyEmail,
    resendVerification,
    getMe
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10,15}$/).withMessage('Please enter a valid phone number (10-15 digits)'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
        .optional()
        .isIn(['customer', 'maid']).withMessage('Role must be either customer or maid')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

const resendVerificationValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail()
];

// Routes
// POST /api/auth/register - Register new user
router.post('/register', registerValidation, register);

// POST /api/auth/login - Login user
router.post('/login', loginValidation, login);

// GET /api/auth/verify/:token - Verify email
router.get('/verify/:token', verifyEmail);

// POST /api/auth/resend-verification - Resend verification email (rate limited)
router.post('/resend-verification', resendVerificationLimiter, resendVerificationValidation, resendVerification);

// GET /api/auth/me - Get current user (protected)
router.get('/me', protect, getMe);

module.exports = router;
