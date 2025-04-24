import express, { Router } from "express";
import * as LikeController from "../controllers/likeControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


router.post('/add/:postId', verifyToken, LikeController.addNewLike);
router.post('/remove/:postId', verifyToken, LikeController.removeALike);
router.get('/getLikesCountAndMe/:postId', verifyToken, LikeController.getLikesCountAndMe);


export default router;
