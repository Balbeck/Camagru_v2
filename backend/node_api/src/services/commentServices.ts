import { IComment, createNewComment, deleteCommentByCommentId } from "../models/commentSchema";
import { IUser } from "../models/userSchema";

import * as UserService from '../services/userServices';

import mongoose from "mongoose";


export const createComment = async (postIdString: string, userIdString: string, comment: string): Promise<IComment> => {
	// - -[ ID Verifications ]- -
	try {
		if (!mongoose.Types.ObjectId.isValid(postIdString)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}

		const postId = new mongoose.Types.ObjectId(postIdString);
		const userId = new mongoose.Types.ObjectId(userIdString);
		const newComment = await createNewComment(userId, postId, comment);
		console.log('💬 [S] New Comment Created !');

		return newComment;

	} catch (error) {
		console.log('💬 [S] createComment ❌ Error: \n', error);
		throw error;
	}
};

export const deleteComment = async (commentIdString: string): Promise<IComment> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(commentIdString)) {
			throw new Error('INVALID_COMMENT_ID');
		}

		const commentId = new mongoose.Types.ObjectId(commentIdString);
		const deletedComment = await deleteCommentByCommentId(commentId);

		return deletedComment;

	} catch (error) {
		throw error;
	}
};
