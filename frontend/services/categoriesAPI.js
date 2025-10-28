import api, { setAuthToken } from "./api";

export const categoriesAPI = {
    getAll: async (token) => {
        setAuthToken(token);
        const response = await api.get('/categories');
        return response.data.categories;
    },

    getById: async (token, categoryId) => {
        setAuthToken(token);
        const response = await api.get('/categories/category', {
            data: { categoryId }
        });
        return response.data.category;
    },

    create: async (token, formData) => {
        setAuthToken(token);
        const response = await api.post('/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.category;
    },

    update: async (token, categoryId, formData) => {
        setAuthToken(token);
        const response = await api.put('/categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    delete: async (token, categoryId) => {
        setAuthToken(token);
        const response = await api.delete('/categories', {
            data: { categoryId }
        });
        return response.data;
    }
};
