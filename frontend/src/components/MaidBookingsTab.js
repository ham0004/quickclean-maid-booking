import React, { useState, useEffect } from 'react';
import { getMaidBookings, acceptBooking, rejectBooking } from '../services/bookingService';
import MaidBookingCard from './MaidBookingCard';

const MaidBookingsTab = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Pending');

    const tabs = ['Pending', 'Accepted', 'Completed', 'Rejected'];

    const fetchBookings = async (status = '') => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMaidBookings(status);
            setBookings(data.bookings || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(activeTab);
    }, [activeTab]);

    const handleAccept = async (bookingId) => {
        try {
            await acceptBooking(bookingId);
            // Refresh bookings
            fetchBookings(activeTab);
        } catch (err) {
            console.error('Error accepting booking:', err);
            alert(err.response?.data?.message || 'Failed to accept booking');
        }
    };

    const handleReject = async (bookingId, reason) => {
        try {
            await rejectBooking(bookingId, reason);
            // Refresh bookings
            fetchBookings(activeTab);
        } catch (err) {
            console.error('Error rejecting booking:', err);
            alert(err.response?.data?.message || 'Failed to reject booking');
        }
    };

    const getTabCount = () => {
        return bookings.length;
    };

    return (
        <div className="maid-bookings-tab">
            <div className="bookings-header">
                <h2>My Bookings</h2>
                <p>Manage your booking requests</p>
            </div>

            {/* Tabs */}
            <div className="bookings-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bookings-content">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading bookings...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>⚠️ {error}</p>
                        <button onClick={() => fetchBookings(activeTab)} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="empty-bookings">
                        <span className="empty-icon">📋</span>
                        <h3>No {activeTab} Bookings</h3>
                        <p>
                            {activeTab === 'Pending'
                                ? "You don't have any pending booking requests."
                                : `You don't have any ${activeTab.toLowerCase()} bookings.`
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bookings-count">
                            Showing {getTabCount()} {activeTab.toLowerCase()} booking(s)
                        </div>
                        <div className="bookings-list">
                            {bookings.map(booking => (
                                <MaidBookingCard
                                    key={booking._id}
                                    booking={booking}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MaidBookingsTab;
