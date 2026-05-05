import { pool } from "./dbconn.js";

export const createUser = async (name, email, password, role = 'user') => {
    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at;
    `;
    const values = [name, email, password, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
};

export const getUsers = async () => {
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

export const getUserById = async (id) => {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const updateUser = async (id, userData) => {
    const { name, email, role } = userData;
    const query = `
        UPDATE users 
        SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $4 
        RETURNING id, name, email, role;
    `;
    const values = [name, email, role, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

// Keep aliases
export const findUserById = getUserById;
export const getAllUsers = getUsers;
