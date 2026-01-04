const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Customer ID is required']
    },
    maidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Maid ID is required']
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: [true, 'Service ID is required']
    },
    bookingDate: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    bookingTime: {
        type: String,
        required: [true, 'Booking time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
    },
    duration: {
        type: Number,
        required: true,
        default: 2,
        min: [1, 'Duration must be at least 1 hour'],
        max: [8, 'Duration cannot exceed 8 hours']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required']
        }
    },
    specialInstructions: {
        type: String,
        maxlength: [1000, 'Special instructions cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    rejectionReason: {
        type: String,
        default: null
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ maidId: 1, status: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
