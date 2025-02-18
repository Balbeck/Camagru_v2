import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as UserController from '../controllers/userControllers';


const router: Router = express.Router()

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', verifyToken, UserController.logout);
router.get('/me', verifyToken, UserController.getMe);
router.post('/updateUser', verifyToken, UserController.updateUser);
router.delete('/delete', verifyToken, UserController.deleteUser);

// router.post('/confirmEmail', verifyToken, UserController.confirmEmail);
// router.post('/forgotPassword', verifyToken, UserController.forgottenPassword);

export default router;
