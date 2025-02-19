import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as CommentController from "../controllers/commentControllers";


const router: Router = express.Router()

router.post('/createComment', verifyToken, CommentController.createComment);
// router.get('/getAllComments', verifyToken, CommentController.getAllComments);
// router.post('/updateComment', verifyToken, CommentController.updateComment);
router.delete('/deleteComment', verifyToken, CommentController.deleteComment);

export default router;
