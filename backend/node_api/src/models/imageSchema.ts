import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import { Comment } from "./commentSchema";
import { Like } from "./likeSchema";
import { Post } from "./postSchema";


interface IImage extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	filename: string;
	contentType: string; // MIME de l'Img - image/jpeg, image/png, image/svg
	data: string; //Img en Base64
	createdAt: Date;
	type: string; // "upload" ou "montage"

}

const imageSchema: Schema = new Schema({
	_id: {
		type: mongoose.Types.ObjectId,
		auto: true
	},
	userId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	filename: {
		type: String,
		required: true
	},
	contentType: {
		type: String,
		required: true
	},
	data: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	type: {
		type: String,
		enum: ["upload", "montage", "gif"],
		default: "upload"
	},
});

const Image = mongoose.model<IImage>('Image', imageSchema);
export { Image, IImage };



export const saveNewImage = async (userId: mongoose.Types.ObjectId, filename: string, contentType: string, data: string, type: string): Promise<IImage | null> => {
	const newImage: IImage = new Image({
		userId: userId,
		filename: filename,
		contentType: contentType,
		data: data,
		createdAt: new Date(),
		type: type
	});
	return await newImage.save();
};


export const getImageById = async (imageId: mongoose.Types.ObjectId): Promise<IImage> => {
	return await
		Image.findById(imageId).exec();
};


export const getImagesByUserId = async (userId: mongoose.Types.ObjectId): Promise<IImage[]> => {
	return await
		Image.find({ userId: userId })
			.sort({ createdAt: -1 })
			.exec();
};


export const deleteAnImage = async (imageId: mongoose.Types.ObjectId): Promise<IImage | null> => {
	return await
		Image.findByIdAndDelete(imageId).exec();
};

export const deleteImageWithCascade = async (imageId: mongoose.Types.ObjectId): Promise<void> => {
	try {
		const image = await Image.findById(imageId).exec();
		if (!image) {
			throw new Error('Image not found');
		}

		const posts = await Post.find({ imageId }).exec();
		for (const post of posts) {
			const postId = post._id;
			await Like.deleteMany({ postId }).exec();
			await Comment.deleteMany({ postId }).exec();
		}

		await Post.deleteMany({ imageId }).exec();
		await Image.findByIdAndDelete(imageId).exec();
		// console.log(` ✅ 🗑️ Image et ses dépendances supprimées avec succès : ${imageId}`);

	} catch (error) {
		// console.log('❌ 🗑️ Erreur lors de la suppression en cascade :', error);
		throw error;
	}
};
