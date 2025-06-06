import { Request, Response, } from "express";
import * as ImageService from '../services/imageServices';
import { IImage } from "models/imageSchema";


export const uploadImage = async (req: Request, res: Response): Promise<void> => {
	try {
		const { filename, contentType, data } = req.body;
		if (!filename || !contentType || !data) {
			res.status(400).json({ message: "Filename, contentType and data are required!" });
			return;
		}
		if (!req.user.id) {
			res.status(404).json({ message: "User ID is missing!" });
			return;
		}

		// verif type MIME de l'img
		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
		if (!allowedMimeTypes.includes(contentType)) {
			res.status(400).json({ message: "Invalid image type. Only JPEG and PNG are allowed." });
			return;
		}

		// verif format de l'img
		const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
		if (!base64Regex.test(data)) {
			res.status(400).json({ message: "Invalid image format. Only Base64 encoded images are allowed." });
			return;
		}
		const maxSize = 5 * 1024 * 1024; // 5MB

		// vraie taille en octets car data en Base64
		const fileSizeInBytes = (data.length * 3) / 4 - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0);

		if (fileSizeInBytes > maxSize) {
			res.status(400).json({ message: "Image size exceeds the maximum limit of 5MB." });
			return;
		}


		const uploadedImage =
			await ImageService.saveImage(
				req.user.id,
				req.body.filename,
				req.body.contentType,
				req.body.data
			);

		// console.log(' 🖼️ [C]*uploadImg ] ✅ ');
		res.status(201).json(uploadImage);

	} catch (error) {
		// console.log(' 🖼️ [C]*uploadImg ] ❌ ');
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

		// console.log(' 🖼️ [C]*AllImg ] ✅ ');
		res.status(201).json(allImages);

	} catch (error) {
		// console.log(' 🖼️ [C]*AllImg ] ❌ ');
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

		// console.log('🗑️ [C]*deleteImage ] ✅ ');
		res.status(201).json({ message: "Image and dependenses deleted successfully!" });

	} catch (error) {
		// console.log('🗑️ [C]*deleteImage ] ❌ ');
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


export const uploadForMontage = async (req: Request, res: Response): Promise<void> => {
	try {
		const { photo, filter, overlayImage, overlaySize } = req.body;
		// console.log(' 🖼️ [C]*uploadMontage ] 🖼️ ', req.body);
		if (!req.user.id) {
			res.status(404).json({ message: "User ID is missing!" });
			return;
		}
		// Verification Img
		if (!photo) {
			res.status(400).json({ message: "Photo (base64) is required!" });
			// console.log(' 🖼️ [C]*uploadMontage ] ❌ !photo ');
			return;
		}
		// console.log(` 🖼️ [C]*uploadMontage ] filter: ${filter},`, filter);
		// console.log(` 🖼️ [C]*uploadMontage ] overlayImage: ${overlayImage} `);
		// console.log(` 🖼️ [C]*uploadMontage ] overlaySize: ${overlaySize} `);
		if (!overlayImage || !overlaySize) {
			res.status(400).json({ message: "Filter, overlayImage and overlaySize are required!" });
			// console.log(' 🖼️ [C]*uploadMontage ] ❌ !filter || !overlayImage || !overlaySize');
			return;
		}
		// verif format Img
		const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
		if (!base64Regex.test(photo)) {
			res.status(400).json({ message: "Invalid image format. Only Base64 encoded images are allowed." });
			// console.log(' 🖼️ [C]*uploadMontage ] ❌ !base64Regex ');
			return;
		}
		const maxSize = 5 * 1024 * 1024; // 5MB
		// vraie taille en octets car data en Base64
		const fileSizeInBytes = (photo.length * 3) / 4 - (photo.endsWith('==') ? 2 : photo.endsWith('=') ? 1 : 0);
		if (fileSizeInBytes > maxSize) {
			res.status(400).json({ message: "Image size exceeds the maximum limit of 5MB." });
			// console.log(' 🖼️ [C]*uploadMontage ] ❌  fileSizeInBytes');
			return;
		}


		// Tente le Montage
		const montage: IImage = await ImageService.montageMe(
			req.user.id,
			photo,
			filter,
			overlayImage,
			overlaySize
		);

		// console.log(' 🖼️ [C]*uploadMontage ] -Montage: ✅ ');
		res.status(201).json(montage);

	} catch (error) {
		// console.log(' 🖼️ [C]*uploadMontage ] ❌ ');
		if (error.message == 'INVALID_USER_ID') {
			res.status(404).json({ message: error.message });
		} else if (error.message == 'INVALID_IMAGE_DATA') {
			res.status(400).json({ message: error.message });
		} else if (error.message == 'MONTAGE_CREATION_FAILED') {
			res.status(400).json({ message: error.message });
		} else {
			res.status(500).json({ message: error.message });
		}
	}
};


export const uploadForGifCreation = async (req: Request, res: Response): Promise<void> => {
	try {
		const { imageIdsString } = req.body;
		// console.log(' 🖼️ [C]*gifCreation ] 🖼️ ', req.body);
		if (!req.user.id) {
			res.status(404).json({ message: "User ID is missing!" });
			return;
		}
		if (!imageIdsString || !Array.isArray(imageIdsString) || imageIdsString.length === 0 || imageIdsString.length > 4) {
			res.status(400).json({ message: "Images array is required!" });
			return;
		}
		if (imageIdsString.length === 0 || imageIdsString.length > 4) {
			res.status(400).json({ message: "Nbr of images could go from 1 up to 4" });
			return;
		}

		const gif = await ImageService.createGif(req.user.id, imageIdsString);
		// console.log(' 🖼️ [C]*gifCreation ] -GIF: ✅ ');
		res.status(201).json(gif);

	} catch (error) {
		// console.log(' 🖼️ [C]*gifCreation ] ❌ ');
		if (error.message == 'INVALID_USER_ID') {
			res.status(404).json({ message: error.message });
		} else if (error.message == 'GIF_CREATION_FAILED') {
			res.status(400).json({ message: error.message });
		} else if (error.message == 'GIF_INVALID_IMAGE_TYPE') {
			res.status(400).json({ message: 'You cannot use a Gif to Create a gif Bro !' });
		} else {
			res.status(500).json({ message: error.message });
		}
	}
}
