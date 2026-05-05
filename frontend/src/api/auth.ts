import axios from "axios";

// Using relative path since Vite proxy handles the backend connection
const API_URL = "/api/auth";

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const register = async (userData: any) => {
    const response = await axios.post(`${API_URL}/create-account`, userData);
    return response.data;
};
