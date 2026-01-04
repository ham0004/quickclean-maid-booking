import api from './api';

// Get all approved maids with pagination
export const getAllMaids = async (page = 1, limit = 12) => {
    const response = await api.get(`/maids?page=${page}&limit=${limit}`);
    return response.data;
};

// Get single maid profile by ID
export const getMaidById = async (id) => {
    const response = await api.get(`/maids/${id}`);
    return response.data;
};
