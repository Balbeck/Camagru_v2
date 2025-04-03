import express, { Router } from "express";
import * as UserController from '../controllers/userControllers';
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


// - - [ NoN Auth Routes ] - -
router.post('/register', UserController.register);
router.get('/confirmRegisterEmail/:token', UserController.confirmRegisterEmail);
router.post('/login', UserController.login);
router.post('/sendforgotPasswordEmail', UserController.forgottenPassword);
router.post('/verifyEmailToken', UserController.verifyEmailToken);
router.post('/resetPassword', UserController.resetPassword);

// - - [ Securised Routes with Jwt ] - -
// router.post('/resetPassword', verifyToken, UserController.resetPassword);
router.post('/logout', verifyToken, UserController.logout);
router.get('/me', verifyToken, UserController.getMe);
router.post('/updateUser', verifyToken, UserController.updateUser);
router.delete('/delete', verifyToken, UserController.deleteUser);
router.get('/checkAuth', verifyToken, (req, res) => {
	res.json({ authenticated: true });
});


export default router;
