import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

// Registration is disabled after initial admin setup
// router.post("/create-account", register);
router.post("/login", login);

export default router;
