// 'use client';

// import React, { useState } from "react";
// import Image from "next/legacy/image";


// const PhotoBoothPage: React.FC = () => {

// 	const posts = [
// 		{
// 			id: 5,
// 			title: 'Un autre post',
// 			photoUrl: '/pacific_5.jpeg',
// 			likes: 17,
// 			lastComment: 'Ouf ! 🌟 ',
// 		},
// 	];


// 	const [selectedImage, setSelectedImage] = useState<File | null>(null);
// 	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

// 	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = event.target.files?.[0];
// 		if (file) {
// 			setSelectedImage(file);
// 			setPreviewUrl(URL.createObjectURL(file));
// 		}
// 	};

// 	const handleUpload = async () => {
// 		if (selectedImage) {
// 			const formData = new FormData();
// 			formData.append('image', selectedImage);

// 			try {
// 				const response = await fetch('/api/upload', {
// 					method: 'POST',
// 					body: formData,
// 				});

// 				if (response.ok) {
// 					console.log('Image uploaded successfully');
// 				} else {
// 					console.error('Failed to upload image');
// 				}
// 			} catch (error) {
// 				console.error('Error uploading image:', error);
// 			}
// 		}
// 	};




// 	return (
// 		<div className="container mx-auto p-12">
// 			<div className="max-w-lg mx-auto shadow-lg rounded-lg">
// 				<Image
// 					src={previewUrl || "/default_profile_picture.jpg"}
// 					alt="Selected"
// 					width={256}
// 					height={256}
// 					className="rounded-full object-cover border border-gray-300"
// 				/>
// 				<input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
// 				<button onClick={handleUpload} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
// 					Upload Image
// 				</button>
// 			</div>
// 		</div>
// 	);
// };











// // 	return (
// // 		<div className="container mx-auto p-12">
// // 			<div className="max-w-lg mx-auto shadow-lg rounded-lg">
// // 				<Image
// // 					src="/default_profile_picture.jpg"
// // 					alt="Default Profile"
// // 					width={256}
// // 					height={256}
// // 					className="rounded-full object-cover border border-gray-300"
// // 				/>
// // 			</div>
// // 		</div>
// // 	);

// // };

// export default PhotoBoothPage;

'use client';

import React, { useState } from "react";
import Image from "next/legacy/image";
import Button from "@/components/Button";


const PhotoBoothPage: React.FC = () => {

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [base64Image, setBase64Image] = useState<string | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			setPreviewUrl(URL.createObjectURL(file));

			// Convertir l'image en base64
			const reader = new FileReader();
			reader.onloadend = () => {
				setBase64Image(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpload = async () => {
		if (base64Image) {
			try {
				const response = await fetch('http://localhost:3000/post/createPost', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ imageUrl: base64Image }),
					credentials: 'include'
				});

				if (response.ok) {
					console.log('Image uploaded successfully');
				} else {
					console.error('Failed to upload image');
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

export default PhotoBoothPage;
