import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as LikeController from "../controllers/likeControllers";


const router: Router = express.Router()


router.post('/addLike', verifyToken, LikeController.addNewLike);
// router.post('/removeLike', verifyToken, LikeController.removeLike);
// router.post('/getLikeCount', verifyToken, LikeController.getLikeCount);

export default router;

