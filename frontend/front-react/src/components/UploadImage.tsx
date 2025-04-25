'use client';

import React, { useState } from "react";
import Image from "next/legacy/image";

interface UploadImageProps {
	onUpload: (file: File, base64Image: string) => void; // Fonction pour gérer l'upload
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload }) => {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [base64Image, setBase64Image] = useState<string | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const limit: number = 5000000; // Limite de 5 Mo
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > limit) {
				alert('File size exceeds the 5Mo limit!');
				return;
			} else if (!['image/jpeg', 'image/png', 'image/svg'].includes(file.type)) {
				alert('Invalid file type, only jpeg, png or svg!');
				return;
			} else {
				setSelectedImage(file);
				setPreviewUrl(URL.createObjectURL(file));

				// Convertir l'image en base64
				const reader = new FileReader();
				reader.onloadend = () => {
					setBase64Image(reader.result as string);
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const handleUploadClick = () => {
		if (selectedImage && base64Image) {
			onUpload(selectedImage, base64Image); // Appelle la fonction passée en prop
		}
	};

	return (
		<div>
			<div className="max-w-lg mx-auto text-center">
				<Image
					src={previewUrl || "/default_profile_picture.jpg"}
					alt="Selected"
					width={256}
					height={256}
					className="rounded-full object-cover border border-gray-300 mx-auto mb-4"
				/>
				<div className="flex justify-center space-x-4">
					<input
						id="file-upload"
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
					/>
					<label htmlFor="file-upload" className="cursor-pointer">
						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							Choose File
						</button>
					</label>
					<button
						type="button"
						className={`bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-6 transition-all duration-200 ${selectedImage ? '' : 'opacity-50 cursor-not-allowed'
							}`}
						onClick={handleUploadClick}
						disabled={!selectedImage}
					>
						Upload Image
					</button>
				</div>
			</div>
		</div >
	);
};

export default UploadImage;
