import express, { Router } from "express";
import * as LikeController from "../controllers/likeControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


router.post('/add', verifyToken, LikeController.addNewLike);
router.post('/remove', verifyToken, LikeController.removeALike);
//   ??? ? ?? ? ? /remove/:id < ---
router.get('/getCount', verifyToken, LikeController.likeCount);
//   ??? ? ?? ? ? /get Count ????  < ---


export default router;
