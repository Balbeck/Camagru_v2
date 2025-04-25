'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import Image from "next/legacy/image";
// import { IPost } from '@/components/Interface';


export interface IPostData {
	_id: string;
	userId: {
		_id: string,
		username: string
	};
	imageId: { data: string };
	title: string;
	createdAt: string;
	likes: {
		nbr_likes: number,
		didILikeIt: boolean
	};
	comments: {
		_id: string,
		userId: {
			_id: string,
			username: string
		},
		text: string,
		createdAt: string
	}[];
};

const MyPosts: React.FC = () => {
	// const router = useRouter();

	const [posts, setPosts] = useState<IPostData[]>([]);
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
					// const data: IPost[] = await response.json();
					const data: IPostData[] = await response.json();
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



	const handleClickLike = async (postId: string, currentIndex: number) => {
		// Copie des posts pour mise à jour locale
		const updatedPosts = [...posts];
		const currentPost = updatedPosts[currentIndex];
		// Détermine si on ajoute ou supprime un like
		const add_or_remove = currentPost.likes.didILikeIt ? "remove" : "add";

		// Mise à jour locale du compteur de likes et de didILikeIt
		if (currentPost.likes.didILikeIt) {
			currentPost.likes.nbr_likes -= 1;
			currentPost.likes.didILikeIt = false;
		} else {
			currentPost.likes.nbr_likes += 1;
			currentPost.likes.didILikeIt = true;
		}
		// Mise à jour de l'état local
		setPosts(updatedPosts);

		try {

			const response = await fetch(`http://localhost:3000/like/${add_or_remove}/${postId}`, {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				console.log('👍 ❌ Erreur lors de la mise à jour des likes sur le backend');
				// Revenir à l'état précédent en cas d'erreur
				currentPost.likes.nbr_likes += currentPost.likes.didILikeIt ? -1 : 1;
				currentPost.likes.didILikeIt = !currentPost.likes.didILikeIt;
				setPosts(updatedPosts);
			}
		} catch (error) {
			console.log('👍 ❌ Erreur lors de la communication avec le backend :', error);
			// Revenir à l'état précédent en cas d'erreur
			currentPost.likes.nbr_likes += currentPost.likes.didILikeIt ? -1 : 1;
			currentPost.likes.didILikeIt = !currentPost.likes.didILikeIt;
			setPosts(updatedPosts);
		}
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

						{/* Bouton Like */}
						<button
							className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm hover:bg-black/80 hover:scale-105 transition-all duration-200"
							// onClick={() => console.log('Like button clicked!')}
							// onClick={() => {
							// 	// Copie des posts pour mise à jour locale
							// 	const updatedPosts = [...posts];
							// 	const currentPost = updatedPosts[currentIndex];

							// 	// Mise à jour du compteur de likes et de didILikeIt
							// 	if (currentPost.likes.didILikeIt) {
							// 		currentPost.likes.nbr_likes -= 1;
							// 		currentPost.likes.didILikeIt = false;
							// 	} else {
							// 		currentPost.likes.nbr_likes += 1;
							// 		currentPost.likes.didILikeIt = true;
							// 	}

							// 	// Mise à jour de l'état local
							// 	setPosts(updatedPosts);
							// }}
							onClick={() => handleClickLike(posts[currentIndex]._id, currentIndex)}
						>
							❤️ {posts[currentIndex].likes.nbr_likes} likes
						</button>

						{/* username en bas à droite SUR la photo */}
						<div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
							{posts[currentIndex].userId.username}
						</div>
					</div>


					{/* Commentaire en dessous, aligné à gauche */}
					<div className="w-full p-3 text-left">
						<p className="text-gray-700 text-sm italic">💬 {posts[currentIndex].comments[0]?.text}</p>
					</div>

					{/* Bouton Delete */}
					<button
						className="mt-2 px-3 py-1 bg-red-500 text-white text-xs mb-1 font-semibold rounded-full shadow-md hover:bg-red-600 transition"
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
