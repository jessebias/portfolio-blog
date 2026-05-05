import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../db/userQueries.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, password, role } = req.body;
    res.status(201).json(await createUser(name, email, password, role));
});

router.get("/", async (req, res) => {
    res.json(await getUsers());
});

router.get("/:id", async (req, res) => {
    res.json(await getUserById(req.params.id));
});

router.put("/:id", async (req, res) => {
    res.json(await updateUser(req.params.id, req.body));
});

router.delete("/:id", async (req, res) => {
    res.json(await deleteUser(req.params.id));
});

export default router;
