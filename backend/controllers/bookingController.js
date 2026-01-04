const Booking = require('../models/Booking');
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const { validationResult } = require('express-validator');
const {
    sendBookingConfirmationEmail,
    sendNewBookingAlertEmail,
    sendBookingAcceptedEmail,
    sendBookingRejectedEmail
} = require('../services/emailService');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            maidId,
            serviceId,
            bookingDate,
            bookingTime,
            duration = 2,
            address,
            specialInstructions
        } = req.body;

        // Validate booking date is not in the past
        const bookingDateTime = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (bookingDateTime < today) {
            return res.status(400).json({
                success: false,
                message: 'Booking date cannot be in the past'
            });
        }

        // Validate booking time (7 AM - 9 PM)
        const [hours] = bookingTime.split(':').map(Number);
        if (hours < 7 || hours >= 21) {
            return res.status(400).json({
                success: false,
                message: 'Booking time must be between 7:00 AM and 9:00 PM'
            });
        }

        // Verify maid exists and is approved
        const maid = await User.findOne({
            _id: maidId,
            role: 'maid',
            verificationStatus: 'approved',
            isVerified: true
        });

        if (!maid) {
            return res.status(404).json({
                success: false,
                message: 'Maid not found or not available'
            });
        }

        // Verify service exists and is active
        const service = await ServiceCategory.findOne({
            _id: serviceId,
            isActive: true
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or not available'
            });
        }

        // Calculate total price
        const totalPrice = service.basePrice * duration;

        // Create booking
        const booking = await Booking.create({
            customerId: req.user._id,
            maidId,
            serviceId,
            bookingDate: bookingDateTime,
            bookingTime,
            duration,
            address,
            specialInstructions,
            totalPrice,
            status: 'Pending'
        });

        // Populate booking for response and emails
        const populatedBooking = await Booking.findById(booking._id)
            .populate('customerId', 'name email phone')
            .populate('maidId', 'name email phone')
            .populate('serviceId', 'name description basePrice priceUnit');

        // Send confirmation emails asynchronously
        try {
            await Promise.all([
                sendBookingConfirmationEmail(populatedBooking, req.user, maid),
                sendNewBookingAlertEmail(populatedBooking, req.user, maid)
            ]);
        } catch (emailError) {
            console.error('Failed to send booking emails:', emailError);
            // Don't fail the booking creation if emails fail
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully! The maid will confirm your booking shortly.',
            booking: populatedBooking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
const getCustomerBookings = async (req, res) => {
    try {
        const { status } = req.query;

        const query = { customerId: req.user._id };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('maidId', 'name email phone profileImage maidProfile.rating')
            .populate('serviceId', 'name description basePrice priceUnit')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error('Get customer bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get maid's bookings
// @route   GET /api/bookings/maid-bookings
// @access  Private (Maid only)
const getMaidBookings = async (req, res) => {
    try {
        const { status } = req.query;

        const query = { maidId: req.user._id };
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('customerId', 'name email phone profileImage')
            .populate('serviceId', 'name description basePrice priceUnit')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error('Get maid bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Accept a booking
// @route   PUT /api/bookings/:id/accept
// @access  Private (Maid only)
const acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            maidId: req.user._id
        })
            .populate('customerId', 'name email phone')
            .populate('maidId', 'name email phone')
            .populate('serviceId', 'name description basePrice priceUnit');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot accept a booking with status: ${booking.status}`
            });
        }

        booking.status = 'Accepted';
        await booking.save();

        // Send acceptance email to customer
        try {
            await sendBookingAcceptedEmail(booking, booking.customerId, booking.maidId);
        } catch (emailError) {
            console.error('Failed to send acceptance email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Booking accepted successfully',
            booking
        });

    } catch (error) {
        console.error('Accept booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Reject a booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Maid only)
const rejectBooking = async (req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findOne({
            _id: req.params.id,
            maidId: req.user._id
        })
            .populate('customerId', 'name email phone')
            .populate('maidId', 'name email phone')
            .populate('serviceId', 'name description basePrice priceUnit');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject a booking with status: ${booking.status}`
            });
        }

        booking.status = 'Rejected';
        booking.rejectionReason = reason || 'No reason provided';
        await booking.save();

        // Send rejection email to customer
        try {
            await sendBookingRejectedEmail(booking, booking.customerId, booking.maidId, reason);
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Booking rejected',
            booking
        });

    } catch (error) {
        console.error('Reject booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createBooking,
    getCustomerBookings,
    getMaidBookings,
    acceptBooking,
    rejectBooking
};
