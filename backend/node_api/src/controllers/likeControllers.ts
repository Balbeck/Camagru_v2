import { Request, Response } from 'express';
import * as LikeService from '../services/likeServices';
import { IPost } from 'models/postSchema';

// [ Ajouter Les StatusCode retour 200, 201, 400, 401, 404, 500, ... ]

export const addNewLike = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 👍 [C]*addNewLike ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const updatedPost: IPost = await LikeService.addNewLike(req.body.postId, req.user.id);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};


export const removeALike = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 👍 [C]*removeALike ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const updatedPost: IPost = await LikeService.removeALike(req.body.postId, req.user.id);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};


export const likeCount = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 👍 [C]*likeCount ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const count: number = await LikeService.getLikeCount(req.body.postId);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
