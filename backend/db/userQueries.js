import { pool } from "./dbconn.js";

export const createUser = async ({ name, email }) => {
    const { rows } = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
    );
    return rows[0];
};

export const getUsers = async () => {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
};

export const getUserById = async (id) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
    ]);
    return rows[0];
};

export const updateUser = async (id, { name, email }) => {
    // Dynamic query construction
    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
        fields.push(`name = $${idx++}`);
        values.push(name);
    }
    if (email) {
        fields.push(`email = $${idx++}`);
        values.push(email);
    }

    // If nothing to update, return the existing user
    if (fields.length === 0) {
        return getUserById(id);
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(
        ", "
    )}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const deleteUser = async (id) => {
    const { rows } = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
    );
    return rows[0];
};
