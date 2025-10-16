import * as userController from '../controllers/user.controller.js'
import { authMiddleware } from "#middlewares/auth.middleware.js";
import express from 'express'

const router = new express.Router();

router.post('/register', userController.register);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
