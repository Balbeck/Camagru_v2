import mongoose from "mongoose";

import { Schema, Document } from "mongoose";


interface IImage extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	filename: string;
	contentType: string; // MIME type of Image ex: image/jpeg, image/png, image/svg
	data: string; //Image stored Base64
	createdAt: Date;
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
});

const Image = mongoose.model<IImage>('Image', imageSchema);
export { Image, IImage };


export const saveNewImage = async (userId: mongoose.Types.ObjectId, filename: string, contentType: string, data: string): Promise<IImage | null> => {
	const newImage: IImage = new Image({
		userId: userId,
		filename: filename,
		contentType: contentType,
		data: data,
		createdAt: new Date()
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
