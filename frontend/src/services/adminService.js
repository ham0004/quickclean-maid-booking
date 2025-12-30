import api from './api';

// Get pending maids
export const getPendingMaids = async () => {
    const response = await api.get('/admin/maids/pending');
    return response.data;
};

// Get all maids with optional filters
export const getAllMaids = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/maids${queryString ? `?${queryString}` : ''}`);
    return response.data;
};

// Approve maid
export const approveMaid = async (maidId, notes = '') => {
    const response = await api.put(`/admin/maids/${maidId}/approve`, { notes });
    return response.data;
};

// Reject maid
export const rejectMaid = async (maidId, reason) => {
    const response = await api.put(`/admin/maids/${maidId}/reject`, { reason });
    return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};
