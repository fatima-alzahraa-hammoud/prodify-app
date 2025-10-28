import api, { setAuthToken } from "./api";

export const productsAPI = {
    getAll: async (token) => {
        setAuthToken(token);
        const response = await api.get('/products');
        return response.data.userProducts;
    },

    getById: async (token, productId) => {
        setAuthToken(token);
        const response = await api.get("/products/product", {
            data: {productId}
        });

        return response.data.product;
    },

    create: async (token, formData) => {
        setAuthToken(token);
        const response = await api.post("/products", formData, {
            headers: {'Content-Type': multipart/form-data}
        });
        return response.data.product;
    },

    update: async (token, productId, formData) => {
        setAuthToken(token);
        const response = await api.put("/products", formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return response.data;
    },

    delete: async (token, productId) => {
        setAuthToken(token);
        const response = await api.delete('/products', {
            data: { productId }
        });
        return response.data;
    }
};