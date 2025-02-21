import { IPost, createNewPost, deletePost, getUserPosts } from "../models/postSchema";
import { IUser } from "../models/userSchema";

import * as UserService from '../services/userServices';

import mongoose from "mongoose";


export const createPost = async (body: any, userIdString: string): Promise<IPost> => {
	// - -[ Find User ID + setValues ]- -
	console.log(' 🖼️ [S]*newPost ]...');
	const user: IUser = await UserService.getUserById(userIdString);
	const userId: mongoose.Types.ObjectId = user._id;
	const title: string = body.title ?? "";

	const newPost: IPost = await createNewPost(userId, body.imageUrl, title);
	console.log(' 🖼️ [S]*newPost return ✅ newPost]');
	return newPost;
};

export const deleteAPost = async (postIdString: string): Promise<IPost> => {
	try {
		console.log(' 🖼️ [S]*deletePost ]...');
		if (!mongoose.Types.ObjectId.isValid(postIdString)) {
			throw new Error('INVALID_POST_ID');
		}

		const postId = new mongoose.Types.ObjectId(postIdString);
		const deletedPost = await deletePost(postId);

		console.log(' 🖼️ [S]*deletePost ] ✅ deleted Post');
		return deletedPost;

	} catch (error) {
		console.log(' 🖼️ [S]*deletePost ] . ❌ . Error');
		throw error;
	}
};

export const getPostsByUserId = async (userIdString: string): Promise<IPost[]> => {
	try {
		console.log(' 🖼️ [S]*GetUserPosts ]...');
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}

		const user: IUser = await UserService.getUserById(userIdString);
		const userId: mongoose.Types.ObjectId = user._id;
		const posts: IPost[] = await getUserPosts(userId);

		console.log(' 🖼️ [S]*GetUserPosts ] ✅ return GetUserPosts[]...');
		return posts;

	} catch (error) {
		console.log(' 🖼️ [S]*GetUserPosts ] . ❌ . Error');
		throw error;
	}
};
