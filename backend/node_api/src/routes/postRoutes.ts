import express, { Router } from "express";
import * as PostController from "../controllers/postControllers";
import { verifyToken } from "../middlewares/authMiddleware";


const router: Router = express.Router()


//  - - [ Fcts to manage a Post ] - - 
router.post('/createPost', verifyToken, PostController.createPost);
router.delete('/deletePost/:postId', verifyToken, PostController.deletePost);


//  - - [ Fcts to GET Post.s ] - - 
router.get('/getAllMyPosts', verifyToken, PostController.getAllMyPosts);
router.get('/getAll', verifyToken, PostController.getAllPosts);
router.get('/getAPost/:postId', verifyToken, PostController.getAPostbyId);

router.get('/getAllPublic', PostController.getAllPublicPosts);


export default router;
