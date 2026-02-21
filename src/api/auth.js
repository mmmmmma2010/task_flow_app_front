import apiClient from './client';

export const login = async (username, password) => {
    const response = await apiClient.post('/api/token/', { username, password });
    return response.data; // { access, refresh }
};

export const refreshToken = async (refresh) => {
    const response = await apiClient.post('/api/token/refresh/', { refresh });
    return response.data; // { access }
};

export const getUsers = async () => {
    const response = await apiClient.get('/api/users/');
    return response.data;
};
