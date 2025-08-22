import axios from "axios";

const API_URL = "http://localhost:8000/api";

const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
const token = user ? user.token : null;

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateProfile = async (userData) => {
    try {
        const response = await axios.put(`${API_URL}/profile`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await axios.put(`${API_URL}/change-password`, passwordData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteAccount = async () => {
    try {
        const response = await axios.delete(`${API_URL}/delete-account`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
