import api from './api';

// Register a new maid with document upload
export const registerMaid = async (maidData) => {
    const formData = new FormData();

    // Append all text fields
    formData.append('name', maidData.name);
    formData.append('email', maidData.email);
    formData.append('phone', maidData.phone);
    formData.append('password', maidData.password);
    formData.append('experience', maidData.experience);
    formData.append('hourlyRate', maidData.hourlyRate);
    formData.append('idType', maidData.idType);
    formData.append('idNumber', maidData.idNumber);

    // Append skills as JSON string
    if (maidData.skills) {
        formData.append('skills', JSON.stringify(maidData.skills));
    }

    // Append bio if provided
    if (maidData.bio) {
        formData.append('bio', maidData.bio);
    }

    // Append the ID document file
    if (maidData.idDocument) {
        formData.append('idDocument', maidData.idDocument);
    }

    const response = await api.post('/maid/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

// Update maid profile
export const updateMaidProfile = async (profileData) => {
    const response = await api.put('/maid/profile', profileData);
    return response.data;
};
