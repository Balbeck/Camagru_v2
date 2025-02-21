import mongoose from "mongoose";

import { IImage, saveNewImage, deleteAnImage, getImageById, getImagesByUserId } from '../models/imageSchema';


export const saveImage = async (userIdString: string, filename: string, contentType: string, data: string): Promise<IImage> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);
		const newImage: IImage = await saveNewImage(userId, filename, contentType, data);

		console.log(' 🍱 [S]saveImage:  [ ✅ ]');
		return newImage;

	} catch (error) {
		console.log(' 🍱 [S]saveImage:  [ ❌ ]');
		throw error;
	}
};


export const getAllImages = async (userIdString: string): Promise<IImage[]> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);

		const allImages: IImage[] = await getImagesByUserId(userId);
		console.log(' 🍱 [S]AllImage:  [ ✅ ]');
		return allImages;

	} catch (error) {
		console.log(' 🍱 [S]AllImage:  [ ❌ ]');
		throw error;
	}
};


export const deleteImage = async (imageIdString: string, userIdString: string): Promise<IImage> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(imageIdString)) {
			throw new Error('INVALID_IMAGE_ID');
		}
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const imageId = new mongoose.Types.ObjectId(imageIdString);
		const userId = new mongoose.Types.ObjectId(userIdString);

		// Control if image belongs to userId
		const img = await getImageById(imageId);
		if (userId !== img.userId) {
			console.log(' 🍱 [S]deleteImage:  ❌ [ userIds Doesnt Match ! ] ');
			throw new Error('INVALID_USER_ID');
		}

		const deletedImage: IImage = await deleteAnImage(imageId);
		console.log(' 🍱 [S]deleteImage:  [ ✅ ]');
		return deletedImage;

	} catch (error) {
		console.log(' 🍱 [S]deleteImage:  [ ❌ ]');
		throw error;
	}
};
