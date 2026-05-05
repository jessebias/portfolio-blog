import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { findUserById } from "../db/userQueries.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(403).json({ message: "User no longer exists" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Admin access required" });
    }
};
