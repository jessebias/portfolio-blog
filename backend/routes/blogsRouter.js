import express from "express";
import { 
    getAllBlogs, 
    getBlog, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} from "../controllers/blogController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/auth-middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlog);

// Admin-protected routes
router.post("/", authenticateToken, authorizeAdmin, createBlog);
router.put("/:id", authenticateToken, authorizeAdmin, updateBlog);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteBlog);

export default router;
