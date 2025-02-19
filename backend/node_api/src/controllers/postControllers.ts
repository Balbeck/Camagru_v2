import { Request, Response } from 'express';
import * as PostService from '../services/postServices';


export const createPost = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 🖼️ [C]*newPost ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const newPost = await PostService.createPost(req.body, req.user.id);
		if (!newPost) {
			res.status(201).json(newPost);
		}
		else {
			res.status(404).json({ message: "Probleme Creation de Post ! Try Again 😘 " });
		}

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 🖼️ [C]*deletePost ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const deletedUser = await PostService.deleteAPost(req.body.postId);
		res.status(200).json({ message: 'Post successfully deleted' });

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
