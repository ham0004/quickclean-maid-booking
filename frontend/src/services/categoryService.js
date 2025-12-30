import api from './api';

// Get all categories (admin)
export const getAllCategories = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/categories${queryString ? `?${queryString}` : ''}`);
    return response.data;
};

// Get single category
export const getCategoryById = async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
};

// Create new category
export const createCategory = async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
};

// Update category
export const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
};

// Delete category (soft delete)
export const deleteCategory = async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
};
