import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

import * as PostController from "../controllers/postControllers";


const router: Router = express.Router()

router.post('/createPost', verifyToken, PostController.createPost);
// router.post('/getPost', verifyToken, PostController.createPost);
// router.post('/getLastNPosts', verifyToken, PostController.createPost);
// router.post('/userPosts', verifyToken, PostController.createPost);
// router.post('/updatePost', verifyToken, PostController.createPost);
// router.post('/deletePost', verifyToken, PostController.createPost);

// router.post('/addLike', verifyToken, PostController.createPost);
// router.post('/removeLike', verifyToken, PostController.createPost);
// router.post('/getLikeCount', verifyToken, PostController.createPost);

export default router;
