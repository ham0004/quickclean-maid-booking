import React, { useState } from 'react';

const MaidBookingCard = ({ booking, onAccept, onReject }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Accepted': return 'status-accepted';
            case 'Completed': return 'status-completed';
            case 'Rejected': return 'status-rejected';
            case 'Cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const handleAccept = async () => {
        setLoading(true);
        try {
            await onAccept(booking._id);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setLoading(true);
        try {
            await onReject(booking._id, rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="maid-booking-card">
            <div className="booking-card-header">
                <div className="customer-info">
                    <div className="customer-avatar">
                        {booking.customerId?.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div className="customer-details">
                        <h4>{booking.customerId?.name || 'Customer'}</h4>
                        <p>{booking.customerId?.email}</p>
                    </div>
                </div>
                <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                </span>
            </div>

            <div className="booking-card-body">
                <div className="booking-info-row">
                    <span className="info-label">📅 Date:</span>
                    <span className="info-value">{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="booking-info-row">
                    <span className="info-label">🕐 Time:</span>
                    <span className="info-value">{booking.bookingTime} ({booking.duration}h)</span>
                </div>
                <div className="booking-info-row">
                    <span className="info-label">🧹 Service:</span>
                    <span className="info-value">{booking.serviceId?.name || 'N/A'}</span>
                </div>
                <div className="booking-info-row">
                    <span className="info-label">📍 Address:</span>
                    <span className="info-value">
                        {booking.address?.street}, {booking.address?.city}
                    </span>
                </div>
                {booking.specialInstructions && (
                    <div className="special-instructions">
                        <span className="info-label">📝 Instructions:</span>
                        <p>{booking.specialInstructions}</p>
                    </div>
                )}
            </div>

            <div className="booking-card-footer">
                <div className="booking-price">
                    <span>Total:</span>
                    <strong>৳{booking.totalPrice}</strong>
                </div>

                {booking.status === 'Pending' && (
                    <div className="booking-actions">
                        <button
                            className="btn-accept"
                            onClick={handleAccept}
                            disabled={loading}
                        >
                            {loading ? '...' : '✓ Accept'}
                        </button>
                        <button
                            className="btn-reject"
                            onClick={() => setShowRejectModal(true)}
                            disabled={loading}
                        >
                            ✗ Reject
                        </button>
                    </div>
                )}

                {booking.status === 'Rejected' && booking.rejectionReason && (
                    <div className="rejection-reason">
                        <strong>Reason:</strong> {booking.rejectionReason}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Reject Booking</h3>
                        <p>Please provide a reason for rejecting this booking:</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows="4"
                        />
                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm-reject"
                                onClick={handleReject}
                                disabled={loading || !rejectReason.trim()}
                            >
                                {loading ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaidBookingCard;
