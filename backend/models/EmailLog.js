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
        enum: ['Verification', 'Approval', 'Rejection', 'Booking', 'Welcome'],
        required: true
    },
    status: {
        type: String,
        enum: ['Sent', 'Failed'],
        default: 'Sent'
    },
    retryCount: {
        type: Number,
        default: 0
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    errorMessage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for querying failed emails
emailLogSchema.index({ status: 1, retryCount: 1 });
emailLogSchema.index({ userId: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
