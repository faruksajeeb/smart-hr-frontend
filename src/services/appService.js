import axios from "../lib/axios";

export const getMe = async () => {
    try {
        const response = await axios.get(`/me`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

