import { Request, Response } from 'express';
import * as PostService from '../services/postServices';
import { IPost } from '../models/postSchema';


export const createPost = async (req: Request, res: Response): Promise<void> => {
	try {
		// console.log(' 📸 [C]*newPost ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const title: string = req.body.title;
		const imageId: string = req.body.imageId;
		const userId: string = req.user.id;
		const newPost = await PostService.createPost(imageId, userId, title);
		if (!newPost) {
			// console.log(' 📸 [C]*newPost ] ❌ ');
			res.status(404).json({ message: "Probleme Creation de Post ! Try Again 😘 " });
		}
		else {
			// console.log(' 📸 [C]*newPost ] ✅ ');
			res.status(201).json(newPost);
		}

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};


export const deletePost = async (req: Request, res: Response): Promise<void> => {
	try {
		// console.log(' 📸 🗑️ [C]*deletePost ] ...');
		const postId: string = req.params.postId;
		if (!postId) {
			res.status(404).json({ message: "param id: Manquant " });
		}
		// verifie que Post appartient au USer
		const post: IPost = await PostService.getAPostbyPostId(postId);
		if (!post) {
			// console.log(' 📸 🗑️ [C]*deletePost ] ❌ Post not found');
			res.status(404).json({ message: "Post not found!" });
			return;
		}
		// console.log(' 📸 🗑️ [C]*deletePost ] post.userId: ', post.userId._id.toString(), ' req.user.id: ', req.user.id);
		if (post.userId._id.toString() !== req.user.id) {
			// console.log(' 📸 🗑️ [C]*deletePost ] ❌ Unauthorized');
			res.status(403).json({ message: "Unauthorized" });
			return;
		}
		await PostService.deletePostAndRelations(postId);
		// console.log(' 📸 🗑️ [C]*deletePost ] ✅ Post deleted');
		res.status(200).json({ message: "Post deleted successfully!" });

	} catch (error) {
		// console.log(' 📸 🗑️ [C]*deletePost ] ❌ Error:', error.message);
		res.status(500).json({ message: error.message });
	}
};


export const getAllMyPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		// console.log(' 🖼️ [C]*getUserPosts ]... ');
		const posts = await PostService.getPostsByUserId(req.user.id);
		if (!posts) {
			res.status(404).json({ message: " ❌ pb avec posts[] " });
		}
		else {
			// console.log(' 🖼️ [C]*getUserPosts ] ✅ return Posts[]... ');
			res.status(201).json(posts);
		}

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		const page: number = parseInt(req.query.page as string) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;
		const { posts, totalPosts, totalPages } = await PostService.getAllPosts(req.user.id, skip, limit);
		if (!posts) {
			res.status(404).json({ message: " ❌ pb avec posts[] " });
		}
		else {
			// console.log(' 📸 [C]*getAllPosts ] ✅ return Posts[]... ');
			res.status(201).json({
				posts,
				totalPosts,
				totalPages,
				currentPage: page,
			});
		}
	} catch (error) {
		// console.log(' 📸 [C]*getAllPosts ] ❌ Error: ', error.message);
		res.status(500).json({ message: error.message });
	}
};


export const getAllPublicPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		// console.log(' 📸 [C]*getAllPublicPosts ]... ');
		const page: number = parseInt(req.query.page as string) || 1;
		const limit = 5;
		const skip = (page - 1) * limit;
		const { posts, totalPosts, totalPages } = await PostService.getAllPublicPosts(skip, limit);
		if (!posts) {
			res.status(404).json({ message: " ❌ pb avec posts[] " });
		}
		else {
			// console.log(' 📸 [C]*getAllPublicPosts ] ✅ return Posts[]... ');
			res.status(201).json({
				posts,
				totalPosts,
				totalPages,
				currentPage: page,
			});
		}
	} catch (error) {
		// console.log(' 📸 [C]*getAllPublicPosts ] ❌ Error: ', error.message);
		res.status(500).json({ message: error.message });
	}
};


export const getAPostbyId = async (req: Request, res: Response): Promise<void> => {
	try {
		const postId: string = req.params.postId;
		if (!postId) {
			res.status(404).json({ message: "param id: Manquant " });
		}
		const post: IPost = await PostService.getAPostbyPostId(postId);
		// console.log(' 📸 [C]*getAPostbyId ] ✅ return Post... ');
		res.status(201).json(post);

	} catch (error) {
		// console.log(' 📸 [C]*getAPostbyId ] ❌ Error: ', error.message);
		res.status(500).json({ message: error.message });
	}
};
