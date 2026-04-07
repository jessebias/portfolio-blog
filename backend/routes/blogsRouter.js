import express from "express";
import {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} from "../db/blogQueries.js";

const router = express.Router();

router.post("/", async (req, res) => {
    res.status(201).json(await createBlog(req.body));
});

router.get("/", async (req, res) => {
    res.json(await getBlogs());
});

router.get("/:id", async (req, res) => {
    res.json(await getBlogById(req.params.id));
});

router.put("/:id", async (req, res) => {
    res.json(await updateBlog(req.params.id, req.body));
});

router.delete("/:id", async (req, res) => {
    res.json(await deleteBlog(req.params.id));
});

export default router;
