import express from "express";
import * as blogController from "../controllers/blog.controller.js";
import { upload } from "#middlewares/upload.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("image"), blogController.createBlog);

export default router;
