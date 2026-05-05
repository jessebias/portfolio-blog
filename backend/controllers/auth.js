import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { createUser, findUserByEmail } from "../db/userQueries.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log("Registering user:", { name, email, role });

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        console.log("Checking for existing user...");
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log("Creating user in database...");
        const newUser = await createUser(name, email, hashedPassword, role || 'user');

        console.log("User created successfully:", newUser.id);
        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ 
            message: "Server error during registration",
            error: err.message 
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            message: "Server error during login",
            error: err.message 
        });
    }
};
