import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Use connection string if available, otherwise individual parameters
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
    try {
        const sqlPath = path.join(__dirname, 'setup-db.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Connecting to database...');
        await pool.query(sql);
        console.log('Database initialized successfully with tables Users and Blogs.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await pool.end();
    }
};

initDb();
