import mongoose from "mongoose";
import {
	IComment,
	createNewComment,
	deleteCommentByCommentId,
	findAllCommentsByPostId,
	findLastCommentByPostId
} from "../models/commentSchema";


export const createComment = async (postId_str: string, userId_str: string, comment: string): Promise<IComment> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}

		const postId = new mongoose.Types.ObjectId(postId_str);
		const userId = new mongoose.Types.ObjectId(userId_str);
		const newComment = await createNewComment(userId, postId, comment);
		console.log('💬 [S] ✅ New Comment Created !');

		return newComment;

	} catch (error) {
		console.log('💬 [S] createComment ❌ Error: \n', error);
		throw error;
	}
};


export const deleteComment = async (commentId_str: string): Promise<IComment> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(commentId_str)) {
			throw new Error('INVALID_COMMENT_ID');
		}
		const commentId = new mongoose.Types.ObjectId(commentId_str);
		const deletedComment = await deleteCommentByCommentId(commentId);
		console.log('💬 [S] ✅ Comment Deleted !');

		return deletedComment;

	} catch (error) {
		console.log('💬 [S]deleteComment ❌ Error: \n', error);
		throw error;
	}
};


export const getAllCommentsByPostId = async (postId_str: string): Promise<IComment[]> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}

		const postId = new mongoose.Types.ObjectId(postId_str);
		const comments: IComment[] = await findAllCommentsByPostId(postId);
		if (!comments || comments.length === 0) {
			throw new Error('NO_COMMENTS_FOUND');
		}
		console.log(`💬 [S]getAllCommentsByPostId ✅ [ ${comments.length} ] comments for post ${postId}`);
		return comments;

	} catch (error) {
		console.log('💬 [S]getCommentsByPostId ❌ Error: \n', error);
		throw error;
	}
}


export const getLastCommentByPostId = async (postId_str: string): Promise<IComment> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_COMMENT_ID');
		}

		const postId = new mongoose.Types.ObjectId(postId_str);
		const comment: IComment = await findLastCommentByPostId(postId);
		if (!comment) {
			throw new Error('NO_COMMENTS_FOUND');
		}
		console.log(`💬 [S]getLastCommentByPostId ✅ last comment: [ ${comment} ]`);
		return comment;

	} catch (error) {
		console.log('💬 [S]getLastCommentByPostId ❌ Error: \n', error);
		throw error;
	}
}
