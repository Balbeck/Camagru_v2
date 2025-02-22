'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import Image from "next/legacy/image";
import Button from "@/components/Button";



const UploadImagePage: React.FC = () => {

	const router = useRouter();

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [base64Image, setBase64Image] = useState<string | null>(null);


	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const limit: number = 5000000; // Limite de 5 Mo 
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > limit) {
				alert(' File size exceeds the 5Mo limit ! ');
				return;
			}
			else if (!['image/jpeg', 'image/png', 'image/svg'].includes(file.type)) {
				alert(' Invalid file type, only jpeg, png or svg ! ');
				return;
			}
			else {
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


	const handleUpload = async () => {
		if (base64Image) {
			try {
				if (selectedImage) {
					const file: File = selectedImage;
					const response = await fetch('http://localhost:3000/image/upload', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							filename: file.name,
							contentType: file.type,
							data: base64Image
						}),
						credentials: 'include'
					});

					if (response.ok) {
						console.log('Image uploaded successfully');
						router.push('myGalerie');

					} else {
						console.error('Failed to upload image');
					}
				}
			} catch (error) {
				console.error('Error uploading image:', error);
			}
		}
	};


	return (
		<div className="container mx-auto p-12">
			<div className="max-w-lg mx-auto shadow-lg rounded-lg p-6 text-center">
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
						<Button
							className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							Choose File
						</Button>
					</label>
					{
						selectedImage ? (
							<Button
								className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-6 transition-all duration-200"
								onClick={handleUpload}
							>
								Upload Image
							</Button>
						)
							: (<Button
								className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-6 transition-all duration-200"
							>
								Upload Image
							</Button>)
					}
				</div>
			</div>
		</div>
	);
};

export default UploadImagePage;
