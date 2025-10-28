import axios from "axios";

const API_BASE_URL = "https://prodify-app-6mmb.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export const setAuthToken = (token) =>{
    if (token){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else{
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;