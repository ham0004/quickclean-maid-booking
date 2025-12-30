const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
const { registerMaid, updateMaidProfile } = require('../controllers/maidController');

// Validation rules for maid registration
const maidRegistrationValidation = [
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
        .matches(/^[0-9]{10,15}$/).withMessage('Please enter a valid phone number'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    body('experience')
        .notEmpty().withMessage('Experience is required')
        .isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    body('hourlyRate')
        .notEmpty().withMessage('Hourly rate is required')
        .isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
    body('idType')
        .notEmpty().withMessage('ID type is required')
        .isIn(['NID', 'Passport', 'Driving License']).withMessage('Invalid ID type'),
    body('idNumber')
        .trim()
        .notEmpty().withMessage('ID number is required')
];

// Profile update validation
const profileUpdateValidation = [
    body('experience')
        .optional()
        .isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    body('hourlyRate')
        .optional()
        .isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
    body('bio')
        .optional()
        .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
];

// POST /api/maid/register - Register new maid with document upload
router.post(
    '/register',
    upload.single('idDocument'),
    handleUploadError,
    maidRegistrationValidation,
    registerMaid
);

// PUT /api/maid/profile - Update maid profile (protected)
router.put(
    '/profile',
    protect,
    authorize('maid'),
    profileUpdateValidation,
    updateMaidProfile
);

module.exports = router;
