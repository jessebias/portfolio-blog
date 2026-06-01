import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, connectDB } from '../db/dbconn.js';

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing required env vars: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
}

await connectDB();

const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

const { rows } = await pool.query(`
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, 'admin')
    ON CONFLICT (email)
    DO UPDATE SET
        name     = EXCLUDED.name,
        password = EXCLUDED.password,
        role     = 'admin',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id, name, email, role
`, [ADMIN_NAME || 'Admin', ADMIN_EMAIL, hashedPassword]);

console.log('Admin account ready:', rows[0]);
await pool.end();
