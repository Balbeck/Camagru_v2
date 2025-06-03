import mongoose from "mongoose";

import { IImage, saveNewImage, getImageById, getImagesByUserId, deleteImageWithCascade } from '../models/imageSchema';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

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


// -- [ Montage ] --
export const montageMe = async (userIdString: string, photo: string, filter: string, overlay: string, overlaySize: number): Promise<IImage> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);

		console.log(` 🍱 [S]montageMe -> createMontage ... `);
		const newMontage = await createMontage(photo, filter, overlay, overlaySize);
		console.log(` 🍱 [S]montageMe:  [ ✅ ] `);
		const filename = `montage_${Date.now()}.png`;
		const contentType = 'image/png';
		const newImage: IImage = await saveNewImage(userId, filename, contentType, newMontage, 'montage');

		console.log(' 🍱 [S]saveMontage:  [ ✅ ]');
		return newImage;

	} catch (error) {
		console.log(' 🍱 [S]saveMontage:  [ ❌ ]');
		throw error;
	}
};


export const createMontage = async (photo: string, filter: string, overlay: string, overlaySize: number): Promise<string> => {
	try {
		const backgroundImg = await loadImage(photo);
		const canvas = createCanvas(backgroundImg.width, backgroundImg.height);
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.drawImage(backgroundImg, 0, 0);

		// Ajoute filtre
		if (filter !== "" && filterMap[filter]) {
			filterMap[filter](ctx, canvas);
			console.log(` 🍱 [S]createMontage:  [ ✅ ] Filter:  "${filter}" applied`);
		}


		// Ajoute overlay
		console.log(` 🍱 [S]createMontage:  [ ✅ ] Overlay:  "${overlay}"`);
		if (overlay) {
			console.log(' 🍱 [S]createMontage: Overlay ...');
			// Charger l'overlay SVG (base64 ou string)
			let svgData = overlay;
			if (!overlay.startsWith('<svg')) {
				// Si c'est du base64
				svgData = Buffer.from(
					overlay.replace(/^data:image\/svg\+xml;base64,/, ''),
					'base64'
				).toString('utf8');
			}
			const svgImg = await loadImage('data:image/svg+xml;base64,' + Buffer.from(svgData).toString('base64'));

			const size = overlaySize
				? (backgroundImg.width * overlaySize) / 100
				: Math.min(backgroundImg.width, backgroundImg.height) / 2;
			const x = (backgroundImg.width - size) / 2;
			const y = (backgroundImg.height - size) / 2;

			ctx.drawImage(svgImg, x, y, size, size);
			console.log(' 🍱 [S]createMontage:  [ ✅ ] Overlay applied');
		}

		// Convertit le canvas en image png base64
		const newMontage = canvas.toDataURL('image/png');
		return newMontage;


	} catch (error) {
		console.error('Error creating montage:', error);
		throw new Error('MONTAGE_CREATION_FAILED');
	}
};


export const filterMap: { [key: string]: (ctx: CanvasRenderingContext2D, canvas: any) => void } = {
	"grayscale(100%)": (ctx, canvas) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
			imageData.data[i] = avg;
			imageData.data[i + 1] = avg;
			imageData.data[i + 2] = avg;
		}
		ctx.putImageData(imageData, 0, 0);
	},
	"sepia(100%)": (ctx, canvas) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const r = imageData.data[i];
			const g = imageData.data[i + 1];
			const b = imageData.data[i + 2];
			imageData.data[i] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
			imageData.data[i + 1] = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
			imageData.data[i + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
		}
		ctx.putImageData(imageData, 0, 0);
	},
	"invert(100%)": (ctx, canvas) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			imageData.data[i] = 255 - imageData.data[i];
			imageData.data[i + 1] = 255 - imageData.data[i + 1];
			imageData.data[i + 2] = 255 - imageData.data[i + 2];
		}
		ctx.putImageData(imageData, 0, 0);
	},
	"saturate(2)": (ctx, canvas) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const gray = 0.2989 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2];
			imageData.data[i] = Math.min(gray + (imageData.data[i] - gray) * 2, 255);
			imageData.data[i + 1] = Math.min(gray + (imageData.data[i + 1] - gray) * 2, 255);
			imageData.data[i + 2] = Math.min(gray + (imageData.data[i + 2] - gray) * 2, 255);
		}
		ctx.putImageData(imageData, 0, 0);
	},
	"contrast(2)": (ctx, canvas) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const factor = (259 * (128 + 255)) / (255 * (259 - 128));
		for (let i = 0; i < imageData.data.length; i += 4) {
			imageData.data[i] = Math.min(factor * (imageData.data[i] - 128) + 128, 255);
			imageData.data[i + 1] = Math.min(factor * (imageData.data[i + 1] - 128) + 128, 255);
			imageData.data[i + 2] = Math.min(factor * (imageData.data[i + 2] - 128) + 128, 255);
		}
		ctx.putImageData(imageData, 0, 0);
	},
	"brightness(1.5)": (ctx, canvas) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			imageData.data[i] = Math.min(imageData.data[i] * 1.5, 255);
			imageData.data[i + 1] = Math.min(imageData.data[i + 1] * 1.5, 255);
			imageData.data[i + 2] = Math.min(imageData.data[i + 2] * 1.5, 255);
		}
		ctx.putImageData(imageData, 0, 0);
	},
};
