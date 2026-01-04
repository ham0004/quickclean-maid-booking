const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    recipientEmail: {
        type: String,
        required: true
    },
    emailType: {
        type: String,
        enum: ['Verification', 'Approval', 'Rejection', 'Booking', 'Welcome', 'BookingConfirmation', 'BookingAlert', 'BookingAccepted', 'BookingRejected'],
        required: true
    },
    status: {
        type: String,
        enum: ['Sent', 'Failed', 'Pending', 'PermanentlyFailed'],
        default: 'Sent'
    },
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 5
    },
    nextRetryAt: {
        type: Date,
        default: null
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    errorMessage: {
        type: String,
        default: null
    },
    // Store email data for retry
    emailData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, {
    timestamps: true
});

// Index for querying failed emails that need retry
emailLogSchema.index({ status: 1, retryCount: 1 });
emailLogSchema.index({ status: 1, nextRetryAt: 1 });
emailLogSchema.index({ userId: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
