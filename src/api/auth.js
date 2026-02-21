import apiClient from './client';

export const login = async (username, password) => {
    const response = await apiClient.post('/api/token/', { username, password });
    return response.data; // { access, refresh }
};

export const refreshToken = async (refresh) => {
    const response = await apiClient.post('/api/token/refresh/', { refresh });
    return response.data; // { access }
};
