import { pool } from "../db/dbconn.js";

const Blog = {
    /**
     * Create a new blog post
     */
    async create({ title, content, category, image_url, user_id }) {
        const { rows } = await pool.query(
            "INSERT INTO blogs (title, content, category, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, content, category || null, image_url || null, user_id]
        );
        return rows[0];
    },

    /**
     * Get all blogs with author details
     */
    async getAll() {
        const query = `
            SELECT blogs.*, row_to_json(users) as user 
            FROM blogs 
            JOIN users ON blogs.user_id = users.id
            ORDER BY blogs.created_at DESC
        `;
        const { rows } = await pool.query(query);
        return rows;
    },

    /**
     * Get a single blog by ID
     */
    async findById(id) {
        const query = `
            SELECT blogs.*, row_to_json(users) as user 
            FROM blogs 
            JOIN users ON blogs.user_id = users.id
            WHERE blogs.id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    /**
     * Update an existing blog post
     */
    async update(id, { title, content, category, image_url }) {
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
        if (category !== undefined) {
            fields.push(`category = $${idx++}`);
            values.push(category);
        }
        if (image_url !== undefined) {
            fields.push(`image_url = $${idx++}`);
            values.push(image_url);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        const query = `
            UPDATE blogs 
            SET ${fields.join(", ")}, updated_at = NOW() 
            WHERE id = $${idx} 
            RETURNING *
        `;

        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    /**
     * Delete a blog post
     */
    async delete(id) {
        const { rows } = await pool.query(
            "DELETE FROM blogs WHERE id = $1 RETURNING *",
            [id]
        );
        return rows[0];
    }
};

export default Blog;
