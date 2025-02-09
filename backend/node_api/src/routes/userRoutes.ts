import express, { Router } from "express";
import * as UserController from '../controllers/userControllers';
import { verifyToken } from "../middlewares/authMiddleware";

const router: Router = express.Router()

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.post('/logout', verifyToken, UserController.logout);

router.post('/forgotPassword', verifyToken, UserController.forgot_password);
router.post('/updateInfos', verifyToken, UserController.update_infos);

export default router;
