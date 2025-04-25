import { Request, Response } from 'express';
import * as LikeService from '../services/likeServices';
import { IPost } from 'models/postSchema';

// [ Ajouter Les StatusCode retour 200, 201, 400, 401, 404, 500, ... ]

export const addNewLike = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId } = req.params;
		const userId = req.user.id;
		console.log(' 👍 [C]*addNewLike ] req.params-> {postId}: ', postId, '\nreq.user.id: ', req.user.id);
		await LikeService.likeAPost(postId, userId);

	} catch (error) {
		res.json({ message: error.message });
	}
};


export const removeALike = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId } = req.params;
		const userId = req.user.id;
		console.log(' 👍 [C]*removeALike ] req.params-> {postId}: ', postId, '\nreq.user.id: ', req.user.id);
		await LikeService.removeALike(postId, userId);

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};


export const getLikesCountAndMe = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId } = req.params;
		const userId = req.user.id;
		console.log(' 👍 [C]*getLikesCountAndMe ] req.params-> {postId}: ', postId, '\nreq.user.id: ', req.user.id);
		const countAndMe = await LikeService.getLikeCountObject(postId, userId);
		res.status(200).json(countAndMe);

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
