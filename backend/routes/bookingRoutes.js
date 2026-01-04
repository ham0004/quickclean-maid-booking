const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize, requireVerified } = require('../middleware/authMiddleware');
const {
    createBooking,
    getMaidBookings,
    acceptBooking,
    rejectBooking,
    getCustomerBookings
} = require('../controllers/bookingController');

// Validation rules for booking creation
const bookingValidation = [
    body('maidId')
        .notEmpty().withMessage('Maid ID is required')
        .isMongoId().withMessage('Invalid maid ID'),
    body('serviceId')
        .notEmpty().withMessage('Service ID is required')
        .isMongoId().withMessage('Invalid service ID'),
    body('bookingDate')
        .notEmpty().withMessage('Booking date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('bookingTime')
        .notEmpty().withMessage('Booking time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
    body('duration')
        .optional()
        .isInt({ min: 1, max: 8 }).withMessage('Duration must be between 1 and 8 hours'),
    body('address.street')
        .notEmpty().withMessage('Street address is required'),
    body('address.city')
        .notEmpty().withMessage('City is required'),
    body('address.postalCode')
        .notEmpty().withMessage('Postal code is required'),
    body('specialInstructions')
        .optional()
        .isLength({ max: 1000 }).withMessage('Special instructions cannot exceed 1000 characters')
];

// Rejection validation
const rejectionValidation = [
    body('reason')
        .optional()
        .isLength({ max: 500 }).withMessage('Rejection reason cannot exceed 500 characters')
];

// POST /api/bookings - Create a new booking (customer only)
router.post(
    '/',
    protect,
    authorize('customer'),
    requireVerified,
    bookingValidation,
    createBooking
);

// GET /api/bookings/my-bookings - Get customer's bookings
router.get(
    '/my-bookings',
    protect,
    authorize('customer'),
    getCustomerBookings
);

// GET /api/bookings/maid-bookings - Get maid's bookings
router.get(
    '/maid-bookings',
    protect,
    authorize('maid'),
    getMaidBookings
);

// PUT /api/bookings/:id/accept - Accept a booking (maid only)
router.put(
    '/:id/accept',
    protect,
    authorize('maid'),
    acceptBooking
);

// PUT /api/bookings/:id/reject - Reject a booking (maid only)
router.put(
    '/:id/reject',
    protect,
    authorize('maid'),
    rejectionValidation,
    rejectBooking
);

module.exports = router;
