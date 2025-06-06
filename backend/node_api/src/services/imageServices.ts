import mongoose from "mongoose";

import { IImage, saveNewImage, getImageById, getImagesByUserId, deleteImageWithCascade } from '../models/imageSchema';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import { convert } from 'imagemagick';
import fs from 'fs';
import { TwitterApi } from 'twitter-api-v2';


export const saveImage = async (userIdString: string, filename: string, contentType: string, data: string): Promise<IImage> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);
		const newImage: IImage = await saveNewImage(userId, filename, contentType, data, 'upload');

		// console.log(' 🍱 [S]saveImage:  [ ✅ ]');
		return newImage;

	} catch (error) {
		// console.log(' 🍱 [S]saveImage:  [ ❌ ]');
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
		// console.log(' 🍱 [S]AllImage:  [ ✅ ]');
		return allImages;

	} catch (error) {
		// console.log(' 🍱 [S]AllImage:  [ ❌ ]');
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

		const img = await getImageById(imageId);
		// console.log(` 🍱 [S]deleteImage: \n ->     userId: ${userId}\n -> img.userId: ${img.userId} `);
		// console.log(` 🍱 [S]deleteImage: \n ->     userIdType: `, typeof userId, `\n -> img.userIdType: `, typeof img.userId);
		if (userId.toString() !== img.userId.toString()) {
			// console.log(' 🍱 [S]deleteImage:  ❌ [ userIds Doesnt Match ! ] ');
			throw new Error('INVALID_USER_ID');
		}

		await deleteImageWithCascade(imageId);
		// console.log(' 🍱 [S]deleteImage:  [ ✅ ]');

	} catch (error) {
		// console.log(' 🍱 [S]deleteImage:  [ ❌ ]');
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

		// console.log(` 🍱 [S]montageMe -> createMontage ... `);
		const newMontage = await createMontage(photo, filter, overlay, overlaySize);
		// console.log(` 🍱 [S]montageMe:  [ ✅ ] `);
		const filename = `montage_${Date.now()}.png`;
		const contentType = 'image/png';
		const newImage: IImage = await saveNewImage(userId, filename, contentType, newMontage, 'montage');

		// console.log(' 🍱 [S]saveMontage:  [ ✅ ]');
		return newImage;

	} catch (error) {
		// console.log(' 🍱 [S]saveMontage:  [ ❌ ]');
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
			// console.log(` 🍱 [S]createMontage:  [ ✅ ] Filter:  "${filter}" applied`);
		}


		// Ajoute overlay
		// console.log(` 🍱 [S]createMontage:  [ ✅ ] Overlay:  "${overlay}"`);
		if (overlay) {
			// console.log(' 🍱 [S]createMontage: Overlay ...');
			// Charge overlay SVG (base64 ou string)
			let svgData = overlay;
			if (!overlay.startsWith('<svg')) {
				// Si est du base64
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
			// console.log(' 🍱 [S]createMontage:  [ ✅ ] Overlay applied');
		}

		// Convertit le canvas en png base64
		const newMontage = canvas.toDataURL('image/png');
		return newMontage;


	} catch (error) {
		// console.log('🍱 [S]createMontage: [ ❌ ] ', error);
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


export const createGif = async (userIdString: string, imageIdsString: string[]): Promise<any> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
			throw new Error('INVALID_USER_ID');
		}
		const userId = new mongoose.Types.ObjectId(userIdString);

		// Verif images sont valides --> moongoose.Types.ObjectId
		if (!Array.isArray(imageIdsString) || imageIdsString.length === 0) {
			throw new Error('INVALID_IMAGES_ARRAY');
		}
		for (const img of imageIdsString) {
			if (!mongoose.Types.ObjectId.isValid(img)) {
				throw new Error('INVALID_IMAGE_ID');
			}
		}

		const tmpFiles: string[] = [];
		let originalWidth = 400;
		let originalHeight = 400;

		for (let i = 0; i < imageIdsString.length; i++) {
			const imgId = imageIdsString[i];
			const img = await getImageById(new mongoose.Types.ObjectId(imgId));
			if (img.type === 'gif') throw new Error('GIF_INVALID_IMAGE_TYPE');
			const imgDataBase64 = img.data.replace(/^data:image\/\w+;base64,/, '');
			const imgBuffer = Buffer.from(imgDataBase64, 'base64');
			const loadedImg = await loadImage(imgBuffer);

			const canvas = createCanvas(originalWidth, originalHeight);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(loadedImg, 0, 0, originalWidth, originalHeight);

			const outBuffer = canvas.toBuffer('image/png');
			const tmpFileName = `tmp_${imgId}_${Date.now()}.png`;
			fs.writeFileSync(tmpFileName, outBuffer);
			tmpFiles.push(tmpFileName);
		}

		// console.log(` 🍱 [S]createGif ... `);
		const filename = `gif_${userIdString}_${Date.now()}.gif`;
		const contentType = 'image/gif';

		await new Promise<void>((resolve, reject) => {
			const args = [
				'-delay', '50',
				'-loop', '0',
				...tmpFiles,
				'-layers', 'Optimize',
				filename
			];
			convert(args, (err: Error) => {
				if (err) {
					// console.log('🍱 [S]createGif:  ❌ ', err);
					reject(new Error('GIF_CREATION_FAILED'));
				} else {
					resolve();
					// console.log(' 🍱 [S]createGif:  [ ✅ ] GIF created successfully');
				}
			});
		});

		const gifBuffer = fs.readFileSync(filename);
		const gifBase64 = `data:image/gif;base64,${gifBuffer.toString('base64')}`;
		const newGif: IImage = await saveNewImage(userId, filename, contentType, gifBase64, 'gif');
		// console.log(' 🍱 [S]saveGif:  [ ✅ ]');

		// Clean tmpFiles
		for (const file of [...tmpFiles, filename]) {
			if (fs.existsSync(file)) {
				fs.unlinkSync(file);
				// console.log(` 🍱 [S]createGif:  [ ✅ ] Deleted tmp file: ${file}`);
			}
		}

		return newGif;

	} catch (error) {
		// console.log(' 🍱 [S]saveGif:  [ ❌ ]: ', error);
		throw error;
	}
}


// export const publishImageOnTwitter = async (userIdString: string, imageIdString: string): Promise<any> => {
// 	try {
// 		if (!mongoose.Types.ObjectId.isValid(userIdString)) {
// 			throw new Error('INVALID_USER_ID');
// 		}
// 		if (!mongoose.Types.ObjectId.isValid(imageIdString)) {
// 			throw new Error('INVALID_IMAGE_ID');
// 		}

// 		const imageId = new mongoose.Types.ObjectId(imageIdString);
// 		const userId = new mongoose.Types.ObjectId(userIdString);

// 		const img = await getImageById(imageId);
// 		if (!img) throw new Error('IMAGE_NOT_FOUND');
// 		if (userId.toString() !== img.userId.toString()) {
// 			throw new Error('INVALID_USER_ID');
// 		}

// 		// On suppose que img.data est en base64 avec préfixe data URI
// 		const base64Data = img.data.replace(/^data:image\/\w+;base64,/, '');
// 		const buffer = Buffer.from(base64Data, 'base64');

// 		// --- Twitter API (exemple avec twitter-api-v2) ---
// 		const client = new TwitterApi({
// 			appKey: process.env.TWITTER_API_KEY!,
// 			appSecret: process.env.TWITTER_API_SECRET!,
// 			accessToken: process.env.TWITTER_ACCESS_TOKEN!,
// 			accessSecret: process.env.TWITTER_ACCESS_SECRET!,
// 		});

// 		// Upload media
// 		const mediaId = await client.v1.uploadMedia(buffer, { mimeType: img.contentType });

// 		// Publie le tweet
// 		const tweet = await client.v1.tweet('Voici mon image !', { media_ids: mediaId });

// 		return tweet;

// 	} catch (error) {
// 		if (error.message === 'IMAGE_NOT_FOUND') throw error;
// 		if (error.message === 'INVALID_USER_ID') throw error;
// 		throw new Error('TWITTER_API_ERROR');
// 	}
// };
