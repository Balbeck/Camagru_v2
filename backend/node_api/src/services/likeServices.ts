import { IPost, addLike } from "models/postSchema";

import * as UserService from '../services/userServices';
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
		console.log(' ❌ [S]*getUserById ] Error: ', error.message);
		throw error;
	}
};
