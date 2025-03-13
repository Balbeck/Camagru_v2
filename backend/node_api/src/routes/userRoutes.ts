import express, { Router } from "express";
import * as UserController from '../controllers/userControllers';
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


// - - [ NoN Auth Routes ] - -
router.post('/register', UserController.register);
router.get('/confirmEmail/:token', UserController.confirmEmail);
router.post('/login', UserController.login);
router.post('/forgotPassword', UserController.forgottenPassword);
router.post('/resetPassword', UserController.resetPassword);


// - - [ Securised Routes with Jwt ] - -
router.post('/logout', verifyToken, UserController.logout);
router.get('/me', verifyToken, UserController.getMe);
router.post('/updateUser', verifyToken, UserController.updateUser);
router.delete('/delete', verifyToken, UserController.deleteUser);
router.get('/checkAuth', verifyToken, (req, res) => {
	res.json({ authenticated: true });
});


export default router;
