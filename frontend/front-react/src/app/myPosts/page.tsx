'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import Image from "next/legacy/image";
import { IPost } from '@/components/Interface';


const MyPosts: React.FC = () => {
	// const router = useRouter();

	const [posts, setPosts] = useState<IPost[]>([]);
	// 🌀 États pour gérer le carrousel (index du post affiché)
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {

		const fetchMyPosts = async () => {
			try {
				const response = await fetch('http://localhost:3000/post/getAllMyPosts', {
					method: 'GET',
					credentials: 'include',
				});

				if (response.ok) {
					const data: IPost[] = await response.json();
					setPosts(data);
					console.log('🌳 [ MyPosts ] fetchMyPosts - postsData: ', data);
				} else {
					console.error('Failed to fetch user posts');
				}
			} catch (error) {
				console.error('Error fetching user posts:', error);
			}
		};

		fetchMyPosts();
	}, []);


	const totalPosts = posts.length;

	// Fonction pour passer au post suivant
	const nextPost = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPosts);
	};

	// Fonction pour passer au post précédent
	const prevPost = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPosts) % totalPosts);
	};


	const openDeleteModal = () => {
		setIsModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsModalOpen(false);
	};



	const handleDeletePost = async () => {
		try {
			const postId = posts[currentIndex]._id; // Récupère l'ID du post actuel
			console.log(`Suppression du post avec l'ID : ${postId}`);

			// Appel API pour supprimer le post
			const response = await fetch(`http://localhost:3000/post/deletePost/${postId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				// Supprime le post localement
				const updatedPosts = posts.filter((_, index) => index !== currentIndex);
				setPosts(updatedPosts);

				// Réinitialise l'index si nécessaire
				if (currentIndex >= updatedPosts.length) {
					setCurrentIndex(0);
				}

				console.log('Post supprimé avec succès');
			} else {
				console.error('Erreur lors de la suppression du post');
			}
		} catch (error) {
			console.error('Erreur lors de la suppression du post :', error);
		} finally {
			closeDeleteModal();
		}
	};



	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] relative">
			<h1 className="text-2xl font-bold mb-4 text-white-800">M✨  P🌳s🌱s !</h1>

			{/* Flèche gauche */}
			<button
				className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={prevPost}
			>
				&#8592;
			</button>

			{/* Conteneur du Post */}
			{posts.length > 0 ? (
				<div className="relative w-[70vw] max-w-[350px] h-[45vh] max-h-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">

					{/* Titre au-dessus de la photo */}
					<div className="w-full bg-white text-gray-900 font-bold text-lg text-center p-2 border-b">
						{posts[currentIndex]?.title}
					</div>

					{/* Image du post */}
					<div className="relative w-full h-3/4">
						<Image
							src={posts[currentIndex]?.imageId?.data}
							alt={posts[currentIndex]?.title}
							layout="fill"
							objectFit="cover"
							quality={75}
						/>

						{/* Like en bas à gauche SUR la photo */}
						<div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
							{/* ❤️ {posts[currentIndex].likes} likes */}
							❤️ 6 likes
						</div>
					</div>

					{/* Commentaire en dessous, aligné à gauche */}
					<div className="w-full p-3 text-left">
						{/* <p className="text-gray-700 text-sm italic">💬 {posts[currentIndex].lastComment}</p> */}
						<p className="text-gray-700 text-sm italic">💬 Commentaire de test 🙏 </p>
					</div>

					{/* Bouton Delete */}
					<button
						className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
						onClick={openDeleteModal}
					>
						Delete Post
					</button>
				</div>
			) : (
				<p className="text-gray-500">Aucun post à afficher.</p>
			)}
			{/* Flèche droite */}
			<button
				className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={nextPost}
			>
				&#8594;
			</button>


			{/* Modal de confirmation */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
						<p>Êtes-vous sûr de vouloir supprimer ce post ?</p>
						<div className="flex justify-end space-x-4 mt-4">
							<button
								className="px-4 py-2 bg-gray-300 rounded-md"
								onClick={closeDeleteModal}
							>
								Annuler
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded-md"
								onClick={handleDeletePost}
							>
								Supprimer
							</button>
						</div>
					</div>
				</div>
			)}

		</div >
	);

};

export default MyPosts;
