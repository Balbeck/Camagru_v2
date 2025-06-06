import { Request, Response } from 'express';
import * as CommentService from '../services/commentServices';
import { IComment } from '../models/commentSchema';
import * as UserService from '../services/userServices';


export const createComment = async (req: Request, res: Response): Promise<void> => {
	try {
		// Besoin de 3 infos, userId, postId, comment
		// userId est dans le token, postId dans params et comment body
		const { postId } = req.params;
		const userId = req.user.id;
		const comment = req.body.comment;
		// console.log(' 💬 [C]*newComment ] req.params: ', req.params, '\nreq.user.id: ', req.user.id, '\ncomment: [ ', comment, ' ]');
		if (!postId) {
			res.status(400).json({ error: "Missing required field: postId" });
			return;
		}
		const newComment: IComment = await CommentService.createComment(postId, userId, comment);
		if (newComment) {
			const formatedComment = {
				_id: newComment._id,
				userId: newComment.userId,
				postId: newComment.postId,
				text: newComment.comment,
				createdAt: newComment.createdAt,
				updateddAt: newComment.updatedAt
			};
			CommentService.SendEmailToPostOwner(req.user.id, postId, comment);
			res.status(201).json(formatedComment);
		}
		else {
			res.status(404).json({ message: "Probleme Creation new Comment ! Try Again 😘 " });
		}

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


export const deleteComment = async (req: Request, res: Response): Promise<void> => {
	try {
		const { commentId } = req.params;
		if (!commentId) {
			res.status(400).json({ error: "Missing required field: commentId" });
			return;
		}
		// console.log(' 💬 [C]*deleteComment ] commentId: ', req.params, '\nreq.user.id: ', req.user.id);
		// verifie que Comment appartient au USer
		const comment: IComment = await CommentService.getCommentById(commentId);
		if (!comment) {
			// console.log(' 💬 [C]*deleteComment ] ❌ Comment not found');
			res.status(404).json({ message: "Comment not found!" });
			return;
		}
		const userId = req.user.id;
		const user = await UserService.getUserById(userId);
		if (!user) {
			// console.log(' 💬 [C]*deleteComment ] ❌ User not found');
			res.status(404).json({ message: "User not found!" });
			return;
		}
		if (comment.userId._id.toString() !== user._id.toString()) {
			// console.log(' 💬 [C]*deleteComment ] ❌ Unauthorized');
			res.status(403).json({ message: "Unauthorized" });
			return;
		}
		const deletedComment = await CommentService.deleteComment(commentId);
		res.status(200).json({ message: 'Comment successfully deleted' });

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


export const getAllCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId } = req.params;
		if (!postId) {
			res.status(400).json({ error: "Missing required field: postId" });
			return;
		}
		const comments = await CommentService.getAllCommentsByPostId(postId);
		if (comments.length > 0) {
			res.status(200).json(comments);
		} else {
			res.status(404).json({ message: 'No comments found for this post' });
		}
	} catch (error: any) {
		if (error.message === 'NO_COMMENTS_FOUND') {
			res.status(204);
		} else {
			res.status(500).json({ message: error.message });
		}
	}
};


export const getLastCommentByPostId = async (req: Request, res: Response): Promise<void> => {
	try {
		const { postId } = req.params;
		if (!postId) {
			res.status(400).json({ error: "Missing required field: postId" });
			return;
		}
		const comment = await CommentService.getLastCommentByPostId(postId);
		if (comment) {
			res.status(200).json(comment);
		} else {
			res.status(404).json({ message: 'No comments found for this post' });
		}
	} catch (error: any) {
		if (error.message === 'NO_COMMENTS_FOUND') {
			res.status(204);
		} else {
			res.status(500).json({ message: error.message });
		}
	}
};
