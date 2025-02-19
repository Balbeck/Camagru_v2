import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as PostController from "../controllers/postControllers";


const router: Router = express.Router()

router.post('/createPost', verifyToken, PostController.createPost);
// router.post('/getPost', verifyToken, PostController.getPost);
// router.post('/getLastNPosts', verifyToken, PostController.getLastNPosts);
// router.post('/userPosts', verifyToken, PostController.userPosts);
// router.post('/updatePost', verifyToken, PostController.updatePost);
router.post('/deletePost', verifyToken, PostController.deletePost);

export default router;
