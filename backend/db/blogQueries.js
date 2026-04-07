import { pool } from "./dbconn.js";

export const createBlog = async ({ title, content, user }) => {
    const { rows } = await pool.query(
        "INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, content, user]
    );
    return rows[0];
};

export const getBlogs = async () => {
    const query = `
        SELECT blogs.*, row_to_json(users) as user 
        FROM blogs 
        JOIN users ON blogs.user_id = users.id
    `;
    const { rows } = await pool.query(query);
    return rows;
};

export const getBlogById = async (id) => {
    const query = `
        SELECT blogs.*, row_to_json(users) as user 
        FROM blogs 
        JOIN users ON blogs.user_id = users.id
        WHERE blogs.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const updateBlog = async (id, { title, content }) => {
    const fields = [];
    const values = [];
    let idx = 1;

    if (title) {
        fields.push(`title = $${idx++}`);
        values.push(title);
    }
    if (content) {
        fields.push(`content = $${idx++}`);
        values.push(content);
    }

    if (fields.length === 0) {
        return getBlogById(id);
    }

    values.push(id);
    const query = `UPDATE blogs SET ${fields.join(
        ", "
    )}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const deleteBlog = async (id) => {
    const { rows } = await pool.query(
        "DELETE FROM blogs WHERE id = $1 RETURNING *",
        [id]
    );
    return rows[0];
};
