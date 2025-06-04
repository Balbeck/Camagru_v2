import mongoose, { Schema, Document } from "mongoose";


interface ILike extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	postId: mongoose.Types.ObjectId;
	createdAt: Date;
}


const likeSchema: Schema = new mongoose.Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		auto: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	postId: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Like = mongoose.model<ILike>('Like', likeSchema);
export { Like, ILike };



export const addLike = async (postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<void> => {
	const existingLike = await Like.findOne({ postId, userId }).exec();
	if (existingLike) {
		throw new Error('Like already exists');
	}
	const newLike: ILike = new Like({
		userId,
		postId,
		createdAt: new Date()
	});

	await newLike.save();
};


export const removeLike = async (postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<void> => {
	const deletedLike = await Like.findOneAndDelete({ postId, userId }).exec();
	if (!deletedLike) {
		throw new Error('Like not found');
	}
};




export const getLikeCountPerPost = async (postId: mongoose.Types.ObjectId): Promise<number> => {
	return await Like.countDocuments({ postId }).exec();
};

export const hasUserLikedAPost = async (userId: mongoose.Types.ObjectId, postId: mongoose.Types.ObjectId): Promise<boolean> => {
	const like = await Like.findOne({ userId, postId }).exec();
	return !!like; // Retourne true si un like existe, sinon false
};
