import User from "../models/User.js";
import { UserDTO, UserListDTO } from "../dtos/UserDTO.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(UserListDTO(users));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(UserDTO(user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createNewUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await User.create(name, email, password, role);
        res.status(201).json(UserDTO(newUser));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUserInfo = async (req, res) => {
    try {
        const updatedUser = await User.update(req.params.id, req.body);
        res.json(UserDTO(updatedUser));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        res.json({ message: "User deleted successfully", id: result.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
