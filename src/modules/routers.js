import express from "express";
import userRoutes from "#users/routes/user.routes.js";
import authRoutes from "#users/routes/auth.routes.js";
import blogRoutes from "#blogs/routes/blog.routes.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/blog", blogRoutes);

export default router;
