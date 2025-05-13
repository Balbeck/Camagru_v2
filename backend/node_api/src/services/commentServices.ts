import mongoose from "mongoose";
import {
	Comment,
	IComment,
	createNewComment,
	deleteCommentByCommentId,
	findAllCommentsByPostId,
	findLastCommentByPostId
} from "../models/commentSchema";
import { Post } from '../models/postSchema';
import nodemailer from 'nodemailer';
import { User } from '../models/userSchema';


const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD
	}
});


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

export const getCommentById = async (commentId_str: string): Promise<IComment> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(commentId_str)) {
			throw new Error('INVALID_COMMENT_ID');
		}
		const commentId = new mongoose.Types.ObjectId(commentId_str);
		const comment = await Comment.findById(commentId).exec();
		if (!comment) {
			throw new Error('COMMENT_NOT_FOUND');
		}
		return comment;
	} catch (error) {
		console.log('💬 [S] getCommentById ❌ Error: \n', error);
		throw error;
	}
};


export const SendEmailToPostOwner = async (userId_str: string, postId_str: string, comment: string): Promise<void> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}

		const userId = new mongoose.Types.ObjectId(userId_str);
		const postId = new mongoose.Types.ObjectId(postId_str);
		// Verif si le post appartient au User
		const commentUser = await User.findById(userId).exec();
		const commentUserName = commentUser.username;
		const post = await Post.findById(postId).exec();
		const postOwner = await User.findById(post.userId).exec();
		const userEmail = postOwner.email;
		if (!post) {
			throw new Error('POST_NOT_FOUND');
		}
		// si le post appartient PAS au User -> send un Email au Owner du post !
		if (post.userId.toString() !== userId.toString()) {
			if (postOwner.isNotificationsEnabled) {
		    const mailOptions = {
        	from: process.env.EMAIL,
        	to: userEmail,
        	subject: 'Someone commented one of your post on Camagru 42 🪆',
        	text: `${commentUserName} commented on your post: "${post.title}"\n\nComment: "${comment}"\n\nCheck it out on Camagru 42!`
   	 		};
		await transporter.sendMail(mailOptions);
		console.log('💬 [S] ✅ Email Sent to Post Owner !');
			}
		}
	} catch (error) {
		console.log('💬 [S] SendEmailToPostOwner ❌ Error: \n', error);
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
