import axios from "../lib/axios";

export const register = async (userData) => {
    try {
        const response = await axios.post(`/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getProfile = async () => {
    try {
        const response = await axios.get(`/profile`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateProfile = async (userData) => {
    try {
        const response = await axios.put(`/profile`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await axios.put(`/change-password`, passwordData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`/logout`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteAccount = async () => {
    try {
        const response = await axios.delete(`/delete-account`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
