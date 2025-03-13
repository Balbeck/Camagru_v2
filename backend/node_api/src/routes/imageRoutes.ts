import express, { Router } from "express";
import * as ImageController from "../controllers/imageControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


router.post('/upload', verifyToken, ImageController.uploadImage);
router.get('/all', verifyToken, ImageController.getAllImagesByUserId);
router.delete('/delete/:id', verifyToken, ImageController.deleteImage);


export default router;
