import { IPost, createNewPost } from "../models/postSchema";
import { IUser } from "../models/userSchema";

import * as UserService from '../services/userServices';

import mongoose from "mongoose";


export const createPost = async (body: any, userIdString: string): Promise<IPost> => {
	// - -[ Find User ID + setValues ]- -
	const user: IUser = await UserService.getUserById(userIdString);
	const userId: mongoose.Types.ObjectId = user._id;
	const imageUrl: string = body.imageUrl;
	const title: string = body.title;

	const newPost: IPost = await createNewPost(userId, imageUrl, title);

	return newPost;
};
