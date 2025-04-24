import { addLike, getLikeCountPerPost, hasUserLikedAPost, removeLike } from "../models/likeSchema";
import mongoose from "mongoose";


export const likeAPost = async (postId_str: string, userId_str: string): Promise<void> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const postId = new mongoose.Types.ObjectId(postId_str);
		const userId = new mongoose.Types.ObjectId(userId_str);

		console.log(' 👍 [S]*addNewLike ] ✅ postId: ', postId_str);
		await addLike(postId, userId);

	} catch (error) {
		console.log(' 👍 [S]*addNewLike ] ❌ Error: ', error.message);
		throw error;
	}
};


export const removeALike = async (postId_str: string, userId_str: string): Promise<void> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const postId = new mongoose.Types.ObjectId(postId_str);
		const userId = new mongoose.Types.ObjectId(userId_str);

		await removeLike(postId, userId);
		console.log(' 👍 [S]*removeALike ] ✅ postId: ', postId_str);

	} catch (error) {
		console.log(' 👍 [S]*removeALike ] ❌ Error: ', error.message);
		throw error;
	}
};


export const getLikeCountObject = async (postId_str: string, userId_str: string): Promise<{}> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(postId_str)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userId_str)) {
			throw new Error('INVALID_USER_ID');
		}
		const postId = new mongoose.Types.ObjectId(postId_str);
		const userId = new mongoose.Types.ObjectId(userId_str);

		const TotalLikesCount: number = await getLikeCountPerPost(postId);
		const didILikeIt: boolean = await hasUserLikedAPost(userId, postId);
		const countAndMe = {
			likesCount: TotalLikesCount,
			likedByMe: didILikeIt
		};

		console.log(' 👍 [S]*getLikeCount ] ✅ countAndMe: ', countAndMe);
		return countAndMe;

	} catch (error) {
		console.log(' 👍 [S]*getLikeCount ] ❌ Error: ', error.message);
		throw error;
	}
};
