import { pool } from "../db/dbconn.js";

const User = {
    /**
     * Create a new user in the database
     */
    async create(name, email, hashedPassword, role = 'user') {
        const query = `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at;
        `;
        const values = [name, email, hashedPassword, role];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    /**
     * Find a user by their email address
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    },

    /**
     * Find a user by their unique ID
     */
    async findById(id) {
        const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    /**
     * Retrieve all users ordered by creation date
     */
    async getAll() {
        const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
        const { rows } = await pool.query(query);
        return rows;
    },

    /**
     * Update an existing user's information
     */
    async update(id, { name, email, role }) {
        const query = `
            UPDATE users 
            SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $4 
            RETURNING id, name, email, role;
        `;
        const values = [name, email, role, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    /**
     * Delete a user from the system
     */
    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
};

export default User;
