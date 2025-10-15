import * as userController from '../controllers/user.controller.js'
import express from 'express'

const router = new express.Router();

router.post('/register', userController.register);

export default router;
