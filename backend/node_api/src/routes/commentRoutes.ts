import express, { Router } from "express";
import * as CommentController from "../controllers/commentControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


router.post('/createComment', verifyToken, CommentController.createComment);
// router.get('/getAllComments', verifyToken, CommentController.getAllComments);
// router.post('/updateComment', verifyToken, CommentController.updateComment);

router.delete('/deleteComment', verifyToken, CommentController.deleteComment);
// Ajouter  --- >   /deleteComment/:id

export default router;
