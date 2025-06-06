'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/legacy/image";

import Button from '@/components/Button';
import CreatePost from '@/components/CreatePostForm';
import { IImage, IPostData } from '@/components/Interface';
import UploadImage from '@/components/UploadImage';
import CreateGif from '@/components/CreateGif';


const MyGalerie: React.FC = () => {

	const router = useRouter();

	const [images, setImages] = useState<IImage[]>([]);

	// State gestion carrousel - index Img
	const [currentIndex, setCurrentIndex] = useState(0);
	const nextImage = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	};
	const prevImage = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
	};

	// Modal pour CreatePost
	const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
	const openCreatePostModal = () => { setCreatePostModalOpen(true); };
	const closeCreatePostModal = () => { setCreatePostModalOpen(false); };

	// Modal pour UploadImage
	const [isUploadImageModalOpen, setUploadImageModalOpen] = useState(false);
	const openUploadImageModal = () => { setUploadImageModalOpen(true); };
	const closeUploadImageModal = () => { setUploadImageModalOpen(false); };

	// Modal pour DeleteImage
	const [isModalOpen, setModalOpen] = useState(false);
	const openDeleteImageModal = () => { setModalOpen(true); };
	const closeDeleteImageModal = () => { setModalOpen(false); };

	// Modal pour GifCreation
	const [isGifCreationModalOpen, setGifCreationModalOpen] = useState(false);
	const openGifCreationModal = () => { setGifCreationModalOpen(true); };
	const closeGifCreationModal = () => { setGifCreationModalOpen(false); };


	const fetchUserimages = async () => {
		try {
			const response = await fetch('http://localhost:3000/image/all', {
				method: 'GET',
				credentials: 'include',
			});

			if (response.ok) {
				const data = await response.json();
				setImages(data);
			}
		} catch (error) {
			console.log('Error fetching user images:', error);
		}
	};


	useEffect(() => {

		fetchUserimages();
	}, [router]);



	const handleUploadImage = async (file: File, base64Image: string) => {
		try {
			// console.log('🌴 [MyGalerie]handleUpload - data: ', base64Image);
			const response = await fetch('http://localhost:3000/image/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					filename: file.name,
					contentType: file.type,
					data: base64Image,
				}),
				credentials: 'include',
			});

			if (response.ok) {
				// console.log('Image uploaded successfully');
				await fetchUserimages()
				closeUploadImageModal();
			}
		} catch (error) {
			console.log('Error uploading image:', error);
		}
	};



	const handleCreatePost = async (dataFromCreatePostForm: IPostData) => {
		try {
			// console.log(' 🌴 [myGaleriePage]handleCreatePost - data: ', dataFromCreatePostForm);
			const response = await fetch(`http://localhost:3000/post/createPost`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataFromCreatePostForm),
				credentials: 'include',
			});

			if (response.ok) {
				router.push("/myPosts");
			}
			closeCreatePostModal();

		} catch (error) {
			console.log(' ❌ Error Creating Post: ', error);
			closeCreatePostModal();
		}
	};



	const handleDelete = async () => {
		try {
			const imageId = images[currentIndex]._id;
			const response = await fetch(`http://localhost:3000/image/delete/${imageId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				// console.log('Image deleted successfully');
				router.replace('/myGalerie')
				setImages((previmages) => previmages.filter((image) => image._id !== imageId));
				closeDeleteImageModal();

			}
		} catch (error) {
			console.log('Error deleting Image:', error);
		}
	};


	const handleCreateGif = async (selectedGifimagesStr: string[]) => {
		try {
			// console.log('🌴 [MyGalerie]handleCreateGif - selectedGifimages: ', selectedGifimagesStr);
			const response = await fetch('http://localhost:3000/image/uploadForGif', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ imageIdsString: selectedGifimagesStr }),
				credentials: 'include',
			});
			const responseData = await response.json();

			if (response.ok) {
				// console.log('Gif created successfully');
				if (responseData) {
					await fetchUserimages();
					setCurrentIndex(0);
				}
				closeGifCreationModal();
			} else {
				alert(`Failed to create Gif -> ${responseData.message}`);
				// console.log('Failed to create Gif');
			}
		} catch (error) {
			console.log('Error creating Gif:', error);
		}
	};


	// const handlePublishOnTwitter = async () => {
	// 	try {
	// 		const imageId = images[currentIndex]._id;
	// 		const response = await fetch(`http://localhost:3000/image/publishOnTwitter/${imageId}`, {
	// 			method: 'POST',
	// 			credentials: 'include',
	// 		});
	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			alert(`Post published on Twitter: ${data.message}`);
	// 		} else {
	// 			const errorData = await response.json();
	// 			alert(`Failed to publish on Twitter: ${errorData.message}`);
	// 		}
	// 	} catch (error) {
	// 		alert(`Error publishing on Twitter: ${error}`);
	// 	}
	// };


	if (images.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Looks Like You never Posted an Image... Let Try 😁 🌱
				</h2>
				<div className="mt-4">
					<Button
						className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-4 text-sm transition-all duration-200"
						onClick={openUploadImageModal}
					>
						Upload image
					</Button>
				</div>
				{/* Modal UploadImage */}
				{isUploadImageModalOpen && (
					<div
						className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
						onClick={closeUploadImageModal}
					>
						<div
							className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-[500px] z-10"
							onClick={(e) => e.stopPropagation()} // click inside ferme pas la modal
						>

							{/* Composant UploadImage */}
							<UploadImage onUpload={handleUploadImage} />

						</div>
					</div>
				)}
			</div>
		);
	}


	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] relative">
			<h1 className="text-2xl font-bold mb-4 text-white-800">My Galerie</h1>

			{/* Fleche gauche */}
			<button
				className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={prevImage}
			>
				&#8592;
			</button>


			{/* Conteneur du Display Img */}
			<div className="relative w-[40vw] max-w-[250px] aspect-square flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">
				{/* Image */}
				<div className="relative w-full h-full">
					<Image
						src={images[currentIndex].data}
						alt={images[currentIndex].filename}
						layout="fill"
						objectFit="cover"
						quality={100}
					/>
				</div>
			</div>

			{/* <div>
				<button
					onClick={handlePublishOnTwitter}
					className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow transition-all duration-200 mt-2"
					title="Publish on Twitter"
				>
					🐦
				</button>
			</div> */}

			{/* Fleche droite */}
			<button
				className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={nextImage}
			>
				&#8594;
			</button>

			{/* Boutons Edit et Delete */}
			<div className="flex space-x-2 mt-4 mb-4">
				<Button
					className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-4 text-sm transition-all duration-200"
					onClick={openCreatePostModal}
				>
					Create Post
				</Button>
				<Button
					className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-4 text-sm transition-all duration-200"
					onClick={openGifCreationModal}
				>
					Gif Creator
				</Button>
			</div>
			{/* Modal CreatePost */}
			{isCreatePostModalOpen && (
				<div
					className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
					onClick={closeCreatePostModal}
				>
					<div
						className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-[500px] z-10"
						onClick={(e) => e.stopPropagation()} // click inside ferme pas la modal
					>
						<CreatePost
							data={images[currentIndex].data}
							imageId={images[currentIndex]._id}
							onPublish={handleCreatePost}
						/>
					</div>
				</div>
			)}
			<div className="flex space-x-2 mt-4 mb-4">
				<Button
					className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-4 text-sm transition-all duration-200"
					onClick={openUploadImageModal}
				>
					Upload image
				</Button>
				<Button
					className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-4 text-sm transition-all duration-200"
					onClick={openDeleteImageModal}
				>
					Delete image
				</Button>
			</div>

			{/* Modale UploadImage */}
			{isUploadImageModalOpen && (
				<div
					className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
					onClick={closeUploadImageModal}
				>
					<div
						className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-[500px] z-10"
						onClick={(e) => e.stopPropagation()} // click inside ferme pas la modal
					>

						{/* Composant UploadImage */}
						<UploadImage onUpload={handleUploadImage} />

					</div>
				</div>
			)}

			{/* Miniatures des photos */}
			<div className="flex justify-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-2 justify-center w-full max-w-[800px]">
				{images.map((image) => (
					<div key={image._id} className="relative w-full aspect-square overflow-hidden rounded-lg shadow-md">
						<Image
							src={image.data}
							alt={image.filename}
							layout="fill"
							objectFit="cover"
							quality={75}
							className="rounded-lg"
						/>
					</div>
				))}
			</div>


			{/* confirmation Modal DeleteImage */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-xl font-bold text-black mb-4 text-center">
							Confirmer la suppression
						</h2>
						<p className="text-gray-800 text-sm text-center">
							Êtes-vous sûr de vouloir supprimer cette image et tous les posts relatifs ?
						</p>
						<div className="flex justify-end space-x-4 mt-6">
							<button
								className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-all duration-200"
								onClick={closeDeleteImageModal}
							>
								Annuler
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
								onClick={handleDelete}
							>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Gif Creator Nodal */}
			{isGifCreationModalOpen && (
				<div
					className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
					onClick={closeGifCreationModal}
				>
					<div
						className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-[500px] z-10"
						onClick={(e) => e.stopPropagation()} //empeche fermeture si click dans Modal
					>
						<CreateGif
							images={images}
							onCreateGif={handleCreateGif}
						/>
					</div>
				</div>
			)}



			{isCreatePostModalOpen && (
				<div
					className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
					onClick={closeCreatePostModal}
				>
					<div
						className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-[500px] z-10"
						onClick={(e) => e.stopPropagation()} //empeche fermeture si click dans Modal
					>
						<CreatePost
							data={images[currentIndex].data}
							imageId={images[currentIndex]._id}
							onPublish={handleCreatePost}
						/>
					</div>
				</div>
			)}




		</div >
	);

};


export default MyGalerie;
