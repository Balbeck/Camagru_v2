import { IPost, addLike, removeLike } from "models/postSchema";
import mongoose from "mongoose";


export const addNewLike = async (postIdString: string, userIdString: string): Promise<IPost> => {
	try {
		console.log(' 🌟 [S]*addNewLike ] postIdString: ', postIdString, '\n 🌟 [S]*addNewLike ] userIdString: ', userIdString);
		// - -[  Vérif si Valid IDs  ]- -
		if (!mongoose.Types.ObjectId.isValid(postIdString)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}

		const postId = new mongoose.Types.ObjectId(postIdString);
		const userId = new mongoose.Types.ObjectId(userIdString);
		const updatedPost = await addLike(postId, userId);
		console.log(' 🌟 [S]*addNewLike ] updatedPost:\n', updatedPost);

		return updatedPost;

	} catch (error) {
		console.log(' ❌ [S]*addNewLike ] Error: ', error.message);
		throw error;
	}
};


export const removeALike = async (postIdString: string, userIdString: string): Promise<IPost> => {
	try {
		console.log(' 🌟 [S]*removeALike ] postIdString: ', postIdString, '\n 🌟 [S]*addNewLike ] userIdString: ', userIdString);
		// - -[  Vérif si Valid IDs  ]- -
		if (!mongoose.Types.ObjectId.isValid(postIdString)) {
			throw new Error('INVALID_POST_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}

		const postId = new mongoose.Types.ObjectId(postIdString);
		const userId = new mongoose.Types.ObjectId(userIdString);
		const updatedPost = await removeLike(postId, userId);
		console.log(' 🌟 [S]*removeALike ] updatedPost:\n', updatedPost);

		return updatedPost;

	} catch (error) {
		console.log(' ❌ [S]*removeALike ] Error: ', error.message);
		throw error;
	}
};


export const getLikeCount = async (postIdString: string): Promise<number> => {
	try {
		console.log(' 🌟 [S]*getLikeCount ] postIdString: ', postIdString);
		const likeCount: number = await getLikeCount(postIdString);
		console.log(' 🌟 [S]*getLikeCount ] likeCount: ', likeCount);

		return likeCount;

	} catch (error) {
		console.log(' ❌ [S]*getLikeCount ] Error: ', error.message);
		throw error;
	}
};
