import { Request, Response, } from "express";
import * as ImageService from '../services/imageServices';


export const uploadImage = async (req: Request, res: Response): Promise<void> => {
	try {
		const uploadedImage =
			await ImageService.saveImage(
				req.user.id,
				req.body.filename,
				req.body.contentType,
				req.body.data
			);

		console.log(' 🖼️ [C]*uploadImg ] ✅ ');
		res.status(201).json(uploadImage);

	} catch (error) {
		console.log(' 🖼️ [C]*uploadImg ] ❌ ');
		if (error.message == 'INVALID_USER_ID') {
			res.status(404).json({ message: error.message });
		}
		else {
			res.status(500).json({ message: error.message });
		}
	}
};


export const getAllImagesByUserId = async (req: Request, res: Response): Promise<void> => {
	try {
		const allImages = await ImageService.getAllImages(req.user.id);

		console.log(' 🖼️ [C]*AllImg ] ✅ ');
		res.status(201).json(allImages);

	} catch (error) {
		console.log(' 🖼️ [C]*AllImg ] ❌ ');
		if (error.message == 'INVALID_USER_ID') {
			res.status(404).json({ message: error.message });
		}
		else {
			res.status(500).json({ message: error.message });
		}
	}
};


export const deleteImage = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.params.imageId) {
			res.status(404).json({ message: "Url's param :id is missing !" });
		}
		const imageId: string = req.params.imageId;
		const userId: string = req.user.id;
		const deletedImage = await ImageService.deleteImage(imageId, req.user.id);

		console.log('🗑️ [C]*deleteImage ] ✅ ');
		res.status(201).json(deletedImage);

	} catch (error) {
		console.log('🗑️ [C]*deleteImage ] ❌ ');
		if (error.message == 'INVALID_IMAGE_ID') {
			res.status(404).json({ message: error.message });
		}
		else if (error.message == 'INVALID_USER_ID') {
			res.status(404).json({ message: error.message });
		}
		else {
			res.status(500).json({ message: error.message });
		}
	}
};
