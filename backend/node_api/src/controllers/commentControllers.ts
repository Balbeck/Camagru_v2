import { Request, Response } from 'express';
import * as CommentService from '../services/commentServices';


export const createComment = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 💬 [C]*newComment ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const newComment = await CommentService.createComment(req.body.postId, req.user.id, req.body.comment);
		if (!newComment) {
			res.status(201).json(newComment);
		}
		else {
			res.status(404).json({ message: "Probleme Creation new Comment ! Try Again 😘 " });
		}

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};


export const deleteComment = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log(' 💬 [C]*deleteComment ] req.body: ', req.body, '\nreq.user.id: ', req.user.id);
		const deletedComment = await CommentService.deleteComment(req.body.commentId);
		res.status(200).json({ message: 'Comment successfully deleted' });

	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
