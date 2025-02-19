import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as LikeController from "../controllers/likeControllers";


const router: Router = express.Router()


router.post('/add', verifyToken, LikeController.addNewLike);
router.post('/remove', verifyToken, LikeController.removeALike);
router.post('/getCount', verifyToken, LikeController.likeCount);

export default router;
