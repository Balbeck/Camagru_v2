import express, { Router } from "express";
import * as UserController from '../controllers/userControllers';

const router: Router = express.Router()

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgotPassword', UserController.forgot_password);
router.post('/updateUserInfos', UserController.update_user_infos);
router.post('/logout', UserController.logout);

export default router;
