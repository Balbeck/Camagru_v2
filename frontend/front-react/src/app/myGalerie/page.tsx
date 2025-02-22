'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/legacy/image";

import Button from '@/components/Button';
import CreatePost from '@/components/CreatePostForm';


interface IImage {
	_id: string;
	userId: string;
	filename: string;
	contentType: string;
	data: string;
	createdAt: Date;
}


const MyGalerie: React.FC = () => {

	const router = useRouter();

	const [images, setimages] = useState<IImage[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	const [isModalOpen, setModalOpen] = useState(false);

	useEffect(() => {

		const fetchUserimages = async () => {
			try {
				const response = await fetch('http://localhost:3000/image/all', {
					method: 'GET',
					credentials: 'include',
				});

				if (response.ok) {
					const data = await response.json();
					setimages(data);
				} else {
					console.error('Failed to fetch user images');
				}
			} catch (error) {
				console.error('Error fetching user images:', error);
			}
		};

		fetchUserimages();

	}, []);


	const nextImage = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	};


	const prevImage = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
	};


	// Fonction pour ouvrir le pop-up
	const openModal = () => {
		setModalOpen(true);
	};

	// Fonction pour fermer le pop-up
	const closeModal = () => {
		setModalOpen(false);
	};


	const handleCreatePost = async (data: any) => {
		try {
			console.log(' 🌴 [myGaleriePage]handleCreatePost - data: ', data);
			const response = await fetch(`http://localhost:3000/post/createPost`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: data.title,
					image: data.image
				}),
				credentials: 'include',
			});

			if (response.ok) {
				router.push("/theWorld");

			} else {

			}
			closeModal(); // Ferme le pop-up

		} catch (error) {
			console.error(' ❌ Error Creating Post: ', error);
			closeModal(); // Ferme le pop-up
		}
	};



	const handleDelete = async (imageId: string) => {
		try {
			const response = await fetch(`http://localhost:3000/image/delete/${imageId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				setimages((previmages) => previmages.filter((image) => image._id !== imageId));
				console.log('Image deleted successfully');
				router.push('/myGalerie')

			} else {
				console.error('Failed to delete Image');
			}
		} catch (error) {
			console.error('Error deleting Image:', error);
		}
	};



	if (images.length === 0) {
		return <div>Looks Like You never Posted an Image \n 😁 Let Try 😁 \nLoading... 🌱</div>;
	}


	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] relative">
			<h1 className="text-2xl font-bold mb-4 text-white-800">My Gallery</h1>

			{/* Flèche gauche */}
			<button
				className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={prevImage}
			>
				&#8592;
			</button>

			{/* Conteneur du Display de l'Image */}
			<div className="relative w-[70vw] max-w-[350px] h-[45vh] max-h-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">
				{/* Image */}
				<div className="relative w-full h-3/4">
					<Image
						src={images[currentIndex].data}
						alt={images[currentIndex].filename}
						layout="fill"
						objectFit="cover"
						quality={75}
					/>
				</div>
			</div>

			{/* Flèche droite */}
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
					onClick={openModal}
				>
					Create Post
				</Button>
			</div>
			{/* Afficher le pop-up si modalOpen est vrai */}
			{isModalOpen && (
				<div
					className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50"
					onClick={closeModal}  // Ferme la fenêtre si on clique à l'extérieur
				>
					<div
						className="relative bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-[500px] z-10"
						onClick={(e) => e.stopPropagation()}  // Empêche la fermeture si on clique à l'intérieur
					>
						<CreatePost data={images[currentIndex].data} onPublish={handleCreatePost} />
					</div>
				</div>
			)}
			<div className="flex space-x-2 mt-4 mb-4">
				<Button
					className="bg-red-500 hover:bg-red-600 text-white rounded-full py-2 px-4 text-sm transition-all duration-200"
					onClick={() => handleDelete(images[currentIndex]._id)}
				>
					Delete
				</Button>
			</div>

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
		</div >
	);

};


export default MyGalerie;
