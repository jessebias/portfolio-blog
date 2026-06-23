import Blog from "../models/Blog.js";
import { BlogDTO, BlogListDTO } from "../dtos/BlogDTO.js";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.getAll();
        res.json(BlogListDTO(blogs));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(BlogDTO(blog));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        const { title, content, category, image_url } = req.body;
        const user_id = req.user.id;

        const newBlog = await Blog.create({ title, content, category, image_url, user_id });
        res.status(201).json(BlogDTO(newBlog));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, content, category, image_url } = req.body;
        const updatedBlog = await Blog.update(req.params.id, { title, content, category, image_url });
        res.json(BlogDTO(updatedBlog));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const result = await Blog.delete(req.params.id);
        res.json({ message: "Blog deleted successfully", id: result.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
