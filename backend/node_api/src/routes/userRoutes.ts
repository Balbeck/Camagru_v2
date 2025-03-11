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
router.get('/checkAuth', verifyToken, (req, res) => {
	res.json({ authenticated: true });
});


router.get('/confirmEmail/:token', UserController.confirmEmail);
router.post('/forgotPassword', UserController.forgottenPassword);
router.post('/resetPassword', UserController.resetPassword);

export default router;
