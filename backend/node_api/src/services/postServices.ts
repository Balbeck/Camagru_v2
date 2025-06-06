import { IPostData, Post } from '../models/postSchema';
import { Comment } from '../models/commentSchema';
import { Like } from '../models/likeSchema';
import { IPost, getUserPosts, getAllThePostsPerPage } from "../models/postSchema";


import mongoose from "mongoose";


export const createPost = async (imageId_str: string, userId_str: string, title: string): Promise<IPost> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(imageId_str)) {
			throw new Error('INVALID_IMAGE_ID');
		}

		const userId = new mongoose.Types.ObjectId(userId_str);
		const imageId = new mongoose.Types.ObjectId(imageId_str);

		const newPost: IPost = new Post({
			userId,
			imageId,
			title,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return await newPost.save();

	} catch (error) {
		// console.log(' 📸 [S]*newPost ] ❌  Error: ', error.message);
		throw error;
	}
};


export const getAllPosts = async (userId_str: string, skip: number, limit: number): Promise<{ posts: IPostData[]; totalPosts: number; totalPages: number }> => {
	try {
		// console.log(' 📸 [S]*GetAllPosts ] ...');
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userId_str);
		const posts = await getAllThePostsPerPage(userId, skip, limit);
		const totalPosts = await Post.countDocuments();
		const totalPages = Math.ceil(totalPosts / limit);
		// console.log(' 📸 [S]*GetAllPosts ] ✅ return GetAllPosts[]...');
		return {
			posts,
			totalPosts,
			totalPages,
		};
	} catch (error) {
		// console.log(' 📸 [S]*GetAllPosts ] . ❌ . Error');
		throw error;
	}
};


export const getAllPublicPosts = async (skip: number, limit: number): Promise<{ posts: IPostData[]; totalPosts: number; totalPages: number }> => {
	try {
		// console.log(' 📸 [S]*GetAllPublicPosts ] ...');
		const posts = await getAllThePostsPerPage(new mongoose.Types.ObjectId(), skip, limit);
		const totalPosts = await Post.countDocuments();
		const totalPages = Math.ceil(totalPosts / limit);
		// console.log(' 📸 [S]*GetAllPublicPosts ] ✅ return GetAllPublicPosts[]...');
		return {
			posts,
			totalPosts,
			totalPages,
		};
	} catch (error) {
		// console.log(' 📸 [S]*GetAllPublicPosts ] . ❌ . Error');
		throw error;
	}
};




export const getPostsByUserId = async (userId_str: string): Promise<{} | null> => {
	try {
		// console.log(' 📸 [S]*GetUserPosts ]...');
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userId_str);

		const posts = await getUserPosts(userId);
		// console.log(' 📸 [S]*GetUserPosts ] ✅ return GetUserPosts[]...');
		return posts;

	} catch (error) {
		// console.log(' 📸 [S]*GetUserPosts ] . ❌ . Error');
		throw error;
	}
};


export const deletePostAndRelations = async (postId_str: string): Promise<void> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}
		const postId = new mongoose.Types.ObjectId(postId_str);

		await Comment.deleteMany({ postId: postId });
		await Like.deleteMany({ postId: postId });
		await Post.findByIdAndDelete(postId);
		// console.log(' 📸 🗑️ [S]*deletePostAndRelations ] ✅ deleted Post and Relations');

	} catch (error) {
		// console.log(' 📸 🗑️ [S]*deletePostAndRelations ] ❌ Error: ', error);
		throw error;
	}

};


export const getAPostbyPostId = async (postId_str: string): Promise<IPost | null> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}

		const postId = new mongoose.Types.ObjectId(postId_str);

		// Recup les post enrichis avec infos (populate) direct des relations sans tout l'objet User et Image !
		const post = await Post.findById(postId)
			.populate('userId', 'username') // inclut username du User
			.populate('imageId') // inclut toutes infos de imageId
			.exec();

		if (!post) {
			throw new Error('POST_NOT_FOUND');
		}

		return post

	} catch (error) {
		// console.log(' 📸 [S]*getAPostbyId ] ❌ Error: ', error.message);
		throw error;
	}
}
