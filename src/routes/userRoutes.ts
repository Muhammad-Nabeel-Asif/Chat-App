import express from "express";

import { getUsers, signUp, login, logout } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

export const router = express.Router();

router.route("/signup").post(signUp);
router.post("/login", login);
router.get("/logout", protect, logout);
router.route("/getUsers").get(protect, getUsers);
