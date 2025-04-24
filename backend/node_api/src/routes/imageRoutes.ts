import express, { Router } from "express";
import * as ImageController from "../controllers/imageControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


router.post('/upload', verifyToken, ImageController.uploadImage);
router.get('/all', verifyToken, ImageController.getAllImagesByUserId);
router.delete('/delete/:imageId', verifyToken, ImageController.deleteImage);

// router.post('/uploadMontage', verifyToken, ImageController.uploadMontage);


export default router;
