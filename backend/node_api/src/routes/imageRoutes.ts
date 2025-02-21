import express, { Router } from "express";

import { verifyToken } from "../middlewares/authMiddleware";
import * as ImageController from "../controllers/imageControllers";


const router: Router = express.Router()

router.post('/upload', verifyToken, ImageController.uploadImage);
router.get('/all', verifyToken, ImageController.getAllImagesByUserId);
router.delete('/delete/:id', verifyToken, ImageController.deleteImage);

export default router;
