import express from "express";
import userRoutes from "#users/routes/user.routes.js";
import blogRoutes from "#blogs/routes/blog.routes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/blog", blogRoutes);

export default router;
