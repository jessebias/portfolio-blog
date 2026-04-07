import axios from 'axios';

// Define the User interface for transparency and consistency
export interface User {
    id: number;
    username: string;
    email?: string;
    role?: string;
    created_at?: string;
}

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get('/api/users');
    return response.data;
};

// Fetch a single user by their ID
export const getUserById = async (id: string | number): Promise<User> => {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
};

// Create a new user
export const createUser = async (userData: Partial<User>): Promise<User> => {
    const response = await axios.post('/api/users', userData);
    return response.data;
};

// Update an existing user
export const updateUser = async (id: string | number, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`/api/users/${id}`, userData);
    return response.data;
};

// Delete a user
export const deleteUser = async (id: string | number): Promise<void> => {
    await axios.delete(`/api/users/${id}`);
};
