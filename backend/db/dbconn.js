import pg from "pg";
import "dotenv/config";
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from "../config.js";

const { Pool } = pg;

export const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
});

export const connectDB = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};