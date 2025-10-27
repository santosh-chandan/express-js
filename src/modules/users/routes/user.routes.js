import * as userController from '../controllers/user.controller.js'
import { authMiddleware } from "#middlewares/auth.middleware.js";
import express from 'express'

const router = new express.Router();

router.post('/register', userController.register);
router.get("/get", authMiddleware, userController.get);
router.put("/update", authMiddleware, userController.update);

export default router;

// GET is meant to retrieve data — it should never modify anything on the server.
// Update operations should use:
// PUT → full update (replace fields)
// or PATCH → partial update (modify some fields)
