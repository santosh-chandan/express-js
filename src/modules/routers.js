import express from "express";
import userRoutes from "#users/routes/user.routes.js";
import authRoutes from "#users/routes/auth.routes.js";
import blogRoutes from "#blogs/routes/blog.routes.js";
import { upload } from "../middlewares/upload.middleware.js";


const router = express.Router();

// upload generic file upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({
    success: true,
    url: imageUrl,
  });
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/blog", blogRoutes);

export default router;
