import express, { Router } from "express";
import UserController from '../controllers/userControllers';

const router: Router = express.Router()


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/updateSettings', UserController.update_settings);


export default router;
