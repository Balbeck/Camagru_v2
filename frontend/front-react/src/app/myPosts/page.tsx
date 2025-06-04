'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/legacy/image";


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

	// State pour carousel + index Img
	const [currentIndex, setCurrentIndex] = useState(0);
	const nextPost = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPosts);
	};
	const prevPost = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPosts) % totalPosts);
	};

	// Modal pour DeletePost
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openDeleteModal = () => {
		setIsModalOpen(true);
	};
	const closeDeleteModal = () => {
		setIsModalOpen(false);
	};


	const [posts, setPosts] = useState<IPostData[]>([]);
	const [newComment, setNewComment] = useState<string>("");
	const [myUserId, setMyUserId] = useState<string>("");
	const [myUsername, setMyUsername] = useState<string>("");


	useEffect(() => {

		const fetchMyPosts = async () => {
			try {
				const response = await fetch('http://localhost:3000/post/getAllMyPosts', {
					method: 'GET',
					credentials: 'include',
				});

				if (response.ok) {
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

		const fetchMyUserId = async () => {
			try {
				const response = await fetch('http://localhost:3000/user/me', {
					method: 'GET',
					credentials: 'include',
				});

				if (response.ok) {
					const data = await response.json();
					setMyUserId(data._id);
					setMyUsername(data.username);
					console.log('🌳 [ MyPosts ] fetchMyUserId - userId: ', data._id);
				} else {
					console.error('Failed to fetch user ID');
				}
			} catch (error) {
				console.error('Error fetching user ID:', error);
			}
		}
		fetchMyUserId();
	}, []);


	const totalPosts = posts.length;



	const handleDeleteComment = async (postId: string, commentId: string) => {
		try {
			const response = await fetch(`http://localhost:3000/comment/deleteComment/${commentId}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (response.ok) {
				// MaJ locale des coms
				setPosts((prevPosts) =>
					prevPosts.map((post) =>
						post._id === postId
							? { ...post, comments: post.comments.filter((comment) => comment._id !== commentId) }
							: post
					)
				);
				console.log("Commentaire supprimé avec succès !");
			} else {
				console.error("Erreur lors de la suppression du commentaire");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression du commentaire :", error);
		}
	};



	const handleAddComment = async (postId: string) => {
		if (!newComment.trim()) return;

		try {
			const response = await fetch(`http://localhost:3000/comment/createComment/${postId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ comment: newComment }),
				credentials: "include",
			});

			if (response.ok) {
				const createdComment = await response.json();
				const formatedCeatedComment = {
					...createdComment,
					'userId': {
						'_id': myUserId,
						'username': myUsername
					}
				};
				console.log('🌳 [ MyPosts ] handleAddComment - createdComment: ', formatedCeatedComment);
				setPosts((prevPosts) =>
					prevPosts.map((post) =>
						post._id === postId
							? { ...post, comments: [...post.comments, formatedCeatedComment] } // Ajoute le nouveau commentaire
							: post
					)
				);
				setNewComment('');

			} else {
				console.error("Failed to add comment");
			}
		} catch (error) {
			console.error("Error adding comment:", error);
		}
	};



	const handleClickLike = async (postId: string, currentIndex: number) => {
		// MaJ locale
		const updatedPosts = [...posts];
		const currentPost = updatedPosts[currentIndex];
		const add_or_remove = currentPost.likes.didILikeIt ? "remove" : "add";

		// locale Maj compteur like + didILikeIt
		if (currentPost.likes.didILikeIt) {
			currentPost.likes.nbr_likes -= 1;
			currentPost.likes.didILikeIt = false;
		} else {
			currentPost.likes.nbr_likes += 1;
			currentPost.likes.didILikeIt = true;
		}
		setPosts(updatedPosts);

		try {

			const response = await fetch(`http://localhost:3000/like/${add_or_remove}/${postId}`, {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				console.log('👍 ❌ Erreur lors de la mise à jour des likes sur le backend');
				// si not Ok revient precedent State
				currentPost.likes.nbr_likes += currentPost.likes.didILikeIt ? -1 : 1;
				currentPost.likes.didILikeIt = !currentPost.likes.didILikeIt;
				setPosts(updatedPosts);
			}
		} catch (error) {
			console.log('👍 ❌ Erreur lors de la communication avec le backend :', error);
			currentPost.likes.nbr_likes += currentPost.likes.didILikeIt ? -1 : 1;
			currentPost.likes.didILikeIt = !currentPost.likes.didILikeIt;
			setPosts(updatedPosts);
		}
	};


	const handleDeletePost = async () => {
		try {
			const postId = posts[currentIndex]._id;
			const response = await fetch(`http://localhost:3000/post/deletePost/${postId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				// Supprime le post localement
				const updatedPosts = posts.filter((_, index) => index !== currentIndex);
				setPosts(updatedPosts);

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
				<div className="relative w-[70vw] max-w-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">

					{/* Titre au dessus de la photo */}
					<div className="w-full bg-white text-gray-900 font-bold text-lg text-center p-2 border-b">
						{posts[currentIndex]?.title}
					</div>

					{/* Image du post */}
					<div className="relative w-full max-h-[250px] aspect-[4/5]">
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
							onClick={() => handleClickLike(posts[currentIndex]._id, currentIndex)}
						>
							❤️ {posts[currentIndex].likes.nbr_likes} likes
						</button>

						{/* username en bas a droite SUR la photo */}
						<div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
							{posts[currentIndex].userId.username}
						</div>
					</div>

					{/* Ajouter un commentaire */}
					<div className="w-full p-3 border-t border-gray-200">
						<form
							className="flex items-center space-x-2"
							onSubmit={(e) => {
								e.preventDefault(); // evite page rechargement
								handleAddComment(posts[currentIndex]._id); // Appelle la fonction pour ajouter com
							}}
						>
							<input
								type="text"
								placeholder="Ajouter un commentaire..."
								className="flex-1 px-3 py-2 border border-blue-400 rounded-full text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)} // Maj State coms
								maxLength={200}
							/>
							<button
								type="submit"
								className="px-3 py-2 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-all duration-200"
							>
								publish
							</button>
						</form>
					</div>


					{/* Liste des com */}
					<div className="w-full p-3 text-left">
						{posts[currentIndex].comments.map((comment) => (
							<div key={comment._id} className="relative mb-4">
								{/* Bouton Delete (croix) */}
								{comment.userId._id === myUserId && (
									<button
										className="absolute top-1 right-2 text-gray-400 hover:text-red-500 text-sm"
										onClick={() => handleDeleteComment(posts[currentIndex]._id, comment._id)}
									>
										&times;
									</button>
								)}

								{/* Username du owne du com */}
								<p className="text-blue-500 text-[10px] italic">
									{comment.userId.username}
								</p>
								{/* Text du com */}
								<p className="text-gray-700 text-xs italic">
									💬 {comment.text}
								</p>
							</div>
						))}
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

			{/* Fleche droite */}
			<button
				className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={nextPost}
			>
				&#8594;
			</button>

			{/* Modal confirmation DeletePost */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-xl font-bold text-black mb-4 text-center">
							Confirmer la suppression
						</h2>
						<p className="text-gray-800 text-sm text-center">
							Êtes-vous sûr de vouloir supprimer ce post ?
						</p>
						<div className="flex justify-end space-x-4 mt-6">
							<button
								className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-all duration-200"
								onClick={closeDeleteModal}
							>
								Annuler
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
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
