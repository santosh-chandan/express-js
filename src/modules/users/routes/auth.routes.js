import express from "express";
import { login, refresh, logout, me } from "../controllers/auth.controller.js";
import { authMiddleware } from "#middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

export default router;
