import { Request, Response } from 'express';
import * as PostService from '../services/postServices';


export const createPost = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 🖼️ [C]*newPost ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const newPost = await PostService.createPost(req.body, req.user.id);
		if (!newPost) {
			console.log(' 🖼️ [C]*newPost ] ❌ ');
			res.status(404).json({ message: "Probleme Creation de Post ! Try Again 😘 " });
		}
		else {
			console.log(' 🖼️ [C]*newPost ] ✅ ');
			res.status(201).json(newPost);
		}

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};


export const deletePost = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 🗑️ [C]*deletePost ] ...');
		if (!req.params.id) {
			res.status(404).json({ message: "param id: Manquant " });
		}
		const postId: string = req.params.id;
		console.log(`🗑️ [C]*deletePost ] req.params.id :  ${postId}`);

		// const deletedPost = await PostService.deleteAPost(postId);
		// if (!deletedPost) {
		// 	console.log('🗑️ [C]*deletePost ] ❌ Post not found');
		// 	res.status(404).json({ message: "Post not found!" });
		// 	return;
		// }
		await PostService.deletePostAndRelations(postId);
		console.log('🗑️ [C]*deletePost ] ✅ Post deleted');
		res.status(200).json({ message: "Post deleted successfully!" });

	} catch (error: any) {
		console.error('🗑️ [C]*deletePost ] ❌ Error:', error.message);
		res.status(500).json({ message: error.message });
	}
};



export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 🖼️ [C]*getUserPosts ]... ');
		const posts = await PostService.getPostsByUserId(req.user.id);
		if (!posts) {
			res.status(404).json({ message: " ❌ pb avec posts[] " });
		}
		else {
			console.log(' 🖼️ [C]*getUserPosts ] ✅ return Posts[]... ');
			res.status(201).json(posts);
		}

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
	try {
		const posts = await PostService.getAllPosts();
		res.status(201).json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
