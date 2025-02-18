import { Request, Response } from 'express';

import * as LikeService from '../services/likeServices';
import { IPost, addLike } from 'models/postSchema';


export const addNewLike = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 👍 [C]*addLike ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const updatedPost: IPost = await LikeService.addNewLike(req.body.postId, req.user.id);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
