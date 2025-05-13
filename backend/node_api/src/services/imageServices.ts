import mongoose from "mongoose";

import { IImage, saveNewImage, deleteAnImage, getImageById, getImagesByUserId, deleteImageWithCascade } from '../models/imageSchema';


export const saveImage = async (userIdString: string, filename: string, contentType: string, data: string): Promise<IImage> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);
		const newImage: IImage = await saveNewImage(userId, filename, contentType, data, 'upload');

		console.log(' 🍱 [S]saveImage:  [ ✅ ]');
		return newImage;

	} catch (error) {
		console.log(' 🍱 [S]saveImage:  [ ❌ ]');
		throw error;
	}
};

export const saveMontage = async (userIdString: string, filename: string, contentType: string, data: string): Promise<IImage> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);
		const newImage: IImage = await saveNewImage(userId, filename, contentType, data, 'montage');

		console.log(' 🍱 [S]saveMontage:  [ ✅ ]');
		return newImage;

	} catch (error) {
		console.log(' 🍱 [S]saveMontage:  [ ❌ ]');
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


export const deleteImage = async (imageIdString: string, userIdString: string): Promise<void> => {
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
		console.log(` 🍱 [S]deleteImage: \n ->     userId: ${userId}\n -> img.userId: ${img.userId} `);
		console.log(` 🍱 [S]deleteImage: \n ->     userIdType: `, typeof userId, `\n -> img.userIdType: `, typeof img.userId);
		if (userId.toString() !== img.userId.toString()) {
			console.log(' 🍱 [S]deleteImage:  ❌ [ userIds Doesnt Match ! ] ');
			throw new Error('INVALID_USER_ID');
		}

		await deleteImageWithCascade(imageId);
		console.log(' 🍱 [S]deleteImage:  [ ✅ ]');

	} catch (error) {
		console.log(' 🍱 [S]deleteImage:  [ ❌ ]');
		throw error;
	}
};
