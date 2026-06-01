import express from "express";
import { pool } from "../db/dbconn.js";
import { authenticateToken } from "../middleware/auth-middleware.js";

const router = express.Router();

const ALLOWED_TABLES = new Set(['blogs', 'users']);

router.get("/schema/:table", async (req, res) => {
    const { table } = req.params;
    if (!ALLOWED_TABLES.has(table)) {
        return res.status(400).json({ message: "Unknown table" });
    }
    try {
        const { rows } = await pool.query(`
            SELECT
                ordinal_position  AS position,
                column_name,
                data_type,
                character_maximum_length,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = $1
            ORDER BY ordinal_position
        `, [table]);
        res.json(rows);
    } catch (err) {
        console.error("Schema query error:", err);
        res.status(500).json({ message: "Failed to fetch schema" });
    }
});

router.get("/users", authenticateToken, async (_req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Meta users error:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

export default router;
