import api from './api';

// Create a new booking
export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

// Get customer's bookings
export const getCustomerBookings = async (status = '') => {
    const url = status ? `/bookings/my-bookings?status=${status}` : '/bookings/my-bookings';
    const response = await api.get(url);
    return response.data;
};

// Get maid's bookings
export const getMaidBookings = async (status = '') => {
    const url = status ? `/bookings/maid-bookings?status=${status}` : '/bookings/maid-bookings';
    const response = await api.get(url);
    return response.data;
};

// Accept a booking (maid only)
export const acceptBooking = async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/accept`);
    return response.data;
};

// Reject a booking (maid only)
export const rejectBooking = async (bookingId, reason = '') => {
    const response = await api.put(`/bookings/${bookingId}/reject`, { reason });
    return response.data;
};
