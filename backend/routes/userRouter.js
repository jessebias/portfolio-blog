import express from "express";
import { 
    getAllUsers, 
    getUserById, 
    createNewUser, 
    updateUserInfo, 
    deleteUserById 
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createNewUser);
router.put("/:id", updateUserInfo);
router.delete("/:id", deleteUserById);

export default router;
