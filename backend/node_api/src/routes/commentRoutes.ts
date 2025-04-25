import express, { Router } from "express";
import * as CommentController from "../controllers/commentControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


router.post('/createComment/:postId', verifyToken, CommentController.createComment);
router.get('/getAllComments/:postId', verifyToken, CommentController.getAllCommentsByPostId);
router.get('/getLastComment/:postId', verifyToken, CommentController.getLastCommentByPostId);
// router.post('/updateComment', verifyToken, CommentController.updateComment);
router.delete('/deleteComment/:commentId', verifyToken, CommentController.deleteComment);

export default router;
