import express, { Router } from "express";
import * as UserController from '../controllers/userControllers';

const router: Router = express.Router()

router.post('/register', UserController.register);
router.get('/login', UserController.login);
router.post('/forgotPassword', UserController.forgot_password);
router.post('/logout', UserController.logout);
router.post('/updateUserInfos', UserController.update_user_infos);

export default router;
