import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as PostController from "../controllers/postControllers";


const router: Router = express.Router()

router.post('/createPost', verifyToken, PostController.createPost);
// router.get('/getPost', verifyToken, PostController.getPost);
// router.get('/getLastNPosts', verifyToken, PostController.getLastNPosts);
router.get('/getUserPosts', verifyToken, PostController.getUserPosts);
// router.post('/updatePost', verifyToken, PostController.updatePost);

// router.delete('/deletePost', verifyToken, PostController.deletePost);
router.delete('/deletePost/:id', verifyToken, PostController.deletePost);

export default router;
