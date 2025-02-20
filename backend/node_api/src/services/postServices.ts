import { IPost, createNewPost, deletePost } from "../models/postSchema";
import { IUser } from "../models/userSchema";

import * as UserService from '../services/userServices';

import mongoose from "mongoose";


export const createPost = async (body: any, userIdString: string): Promise<IPost> => {
	// - -[ Find User ID + setValues ]- -
	const user: IUser = await UserService.getUserById(userIdString);
	const userId: mongoose.Types.ObjectId = user._id;
	const imageUrl: string = body.imageUrl;
	const title: string = body.title ?? "";

	const newPost: IPost = await createNewPost(userId, imageUrl, title);

	return newPost;
};

export const deleteAPost = async (postIdString: string): Promise<IPost> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postIdString)) {
			throw new Error('INVALID_POST_ID');
		}

		const postId = new mongoose.Types.ObjectId(postIdString);
		const deletedPost = await deletePost(postId);

		return deletedPost;

	} catch (error) {
		throw error;
	}
};
