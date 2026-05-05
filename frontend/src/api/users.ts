import axios from "axios";

const API_URL = "/api/users";

export const getProfile = async (token: string) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getAllUsers = async (token: string) => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
