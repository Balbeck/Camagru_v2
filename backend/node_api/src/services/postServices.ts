import { IPostData, Post } from '../models/postSchema';
import { Comment } from '../models/commentSchema';
import { Like } from '../models/likeSchema';
import { IPost, getUserPosts, getAllThePostsPerPage } from "../models/postSchema";
// import { IUser } from "../models/userSchema";

// import * as UserService from '../services/userServices';

import mongoose from "mongoose";


// export const createPost = async (body: any, userId_str: string): Promise<IPost> => {
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

		// console.log(' 📸 [S]*newPost ] body: ', body);
		// const user: IUser = await UserService.getUserById(userId_str);
		// const userId: mongoose.Types.ObjectId = user._id;
		// const title: string = body.title;

		// const newPost: IPost = await createNewPost(userId, body.image, title);
		// console.log(' 📸 [S]*newPost return ✅ newPost]');
		// return newPost;
	} catch (error) {
		console.log(' 📸 [S]*newPost ] ❌  Error: ', error.message);
		throw error;
	}
};

// export const deleteAPost = async (postId_str: string): Promise<IPost> => {
// 	try {
// 		console.log('📸🗑️ [S]*deletePost ] ...');
// 		if (!mongoose.Types.ObjectId.isValid(postIdString)) {
// 			throw new Error('INVALID_POST_ID');
// 		}

// 		const postId = new mongoose.Types.ObjectId(postIdString);
// 		const deletedPost = await deletePost(postId);

// 		console.log(' 📸 🗑️️ [S]*deletePost ] ✅ deleted Post');
// 		return deletedPost;

// 	} catch (error) {
// 		console.log(' 📸 🗑️ [S]*deletePost ] . ❌ . Error');
// 		throw error;
// 	}
// };


export const getAllPosts = async (userId_str: string, skip: number, limit: number): Promise<{ posts: IPostData[]; totalPosts: number; totalPages: number }> => {
	try {
		console.log(' 📸 [S]*GetAllPosts ] ...');
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userId_str);
		const posts = await getAllThePostsPerPage(userId, skip, limit);
		const totalPosts = await Post.countDocuments();
		const totalPages = Math.ceil(totalPosts / limit);
		console.log(' 📸 [S]*GetAllPosts ] ✅ return GetAllPosts[]...');
		return {
			posts,
			totalPosts,
			totalPages,
	};
	} catch (error) {
		console.log(' 📸 [S]*GetAllPosts ] . ❌ . Error');
		throw error;
	}
};



export const getPostsByUserId = async (userId_str: string): Promise<{} | null> => {
	try {
		console.log(' 📸 [S]*GetUserPosts ]...');
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userId_str);

		const posts = await getUserPosts(userId);
		console.log(' 📸 [S]*GetUserPosts ] ✅ return GetUserPosts[]...');
		return posts;

	} catch (error) {
		console.log(' 📸 [S]*GetUserPosts ] . ❌ . Error');
		throw error;
	}
};

// export const getAllPosts = async (): Promise<IPost[]> => {
// 	return await getAllThePosts();
// };


export const deletePostAndRelations = async (postId_str: string): Promise<void> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}
		const postId = new mongoose.Types.ObjectId(postId_str);

		await Comment.deleteMany({ postId: postId });
		await Like.deleteMany({ postId: postId });
		await Post.findByIdAndDelete(postId);
		console.log(' 📸 🗑️ [S]*deletePostAndRelations ] ✅ deleted Post and Relations');

	} catch (error) {
		console.log(' 📸 🗑️ [S]*deletePostAndRelations ] ❌ Error: ', error);
		throw error;
	}

};


// export const getAPostByPostId = async (postId_str: string): Promise<void> => {
export const getAPostbyPostId = async (postId_str: string): Promise<IPost | null> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}

		const postId = new mongoose.Types.ObjectId(postId_str);

		// Récupérer le post avec les relations peuplées
		const post = await Post.findById(postId)
			.populate('userId', 'username') // Inclut uniquement le champ `username` de l'utilisateur
			.populate('imageId') // Inclut toutes les informations de l'image
			.exec();

		if (!post) {
			throw new Error('POST_NOT_FOUND');
		}

		// // Récupérer les commentaires associés au post
		// const comments = await Comment.find({ postId: post._id })
		// 	.populate('userId', 'username') // Inclut le `username` de l'utilisateur pour chaque commentaire
		// 	.select('comment userId createdAt') // Inclut uniquement les champs nécessaires
		// 	.exec();
		// console.log(' 📸 [S]*getAPostbyId ] comments: ', comments);

		// Ajouter les commentaires au post
		// const enrichedPost = {
		// 	...post.toObject(),
		// 	comments: comments
		// };

		// return enrichedPost;
		return post

	} catch (error) {
		console.log(' 📸 [S]*getAPostbyId ] ❌ Error: ', error.message);
		throw error;
	}
}
