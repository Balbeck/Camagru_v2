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

const TheWorld: React.FC = () => {


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
					console.log('🌏 [ AllPosts ] fetchMyUserId - userId: ', data._id);
				} else {
					console.error('Failed to fetch user ID');
				}
			} catch (error) {
				console.error('Error fetching user ID:', error);
			}
	};

    const fetchPosts = async (page: number) => {

        try {
            const response = await fetch(`http://localhost:3000/post/getAll?page=${page}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setPosts((prevPosts) => [...prevPosts, ...data.posts]);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
                console.log('🌏 [ AllPosts ] fetchPosts - postsData: \n', data);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

	
	const [newComment, setNewComment] = useState<string>("");
	const [myUserId, setMyUserId] = useState<string>("");
	const [myUsername, setMyUsername] = useState<string>("");

	const [posts, setPosts] = useState<IPostData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

 

    useEffect(() => {
        fetchPosts(currentPage);
		fetchMyUserId();
    },[] );


	const nextPost = () => {
        const nextIndex = currentIndex + 1;

        // Charge nextPosts sur affichage dde l'avant dernier
        if (nextIndex === posts.length - 2 && currentPage < totalPages) {
            fetchPosts(currentPage + 1);
        }

    
        if (nextIndex >= posts.length) {
            setCurrentIndex(0); //infinite carousel 
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    const prevPost = () => {
        const prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
            setCurrentIndex(posts.length - 1); // infinite carrousel
        } else {
            setCurrentIndex(prevIndex);
        }
    };




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
		// Copie des posts pour Maj locale
		const updatedPosts = [...posts];
		const currentPost = updatedPosts[currentIndex];
		// Détermine si on ajoute ou supprime un like
		const add_or_remove = currentPost.likes.didILikeIt ? "remove" : "add";

		// MaJ locale des likes et de didILikeIt
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



	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] relative">
			<h1 className="text-2xl font-bold mb-4 text-white-800">The W🌏rld !</h1>


			{/* Flèche gauche - Ne 'affiche au 1er post que si l'ensemble des post ont ete load !*/}
			{!(currentIndex === 0 && currentPage < totalPages) && (
			    <button
			        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
			        onClick={prevPost}
			    >
			        &#8592;
			    </button>
			)}



			{/* Conteneur du Post */}
			{posts.length > 0 ? (
				<div className="relative w-[70vw] max-w-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">

					{/* Titre au-dessus de la photo */}
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

						{/* username en bas à droite SUR la photo */}
						<div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
							{posts[currentIndex].userId.username}
						</div>
					</div>

					{/* Ajouter un commentaire */}
					<div className="w-full p-3 border-t border-gray-200">
						<form
							className="flex items-center space-x-2"
							onSubmit={(e) => {
								e.preventDefault(); // Empêche le rechargement de la page
								handleAddComment(posts[currentIndex]._id); // Appelle la fonction pour ajouter un commentaire
							}}
						>
							<input
								type="text"
								placeholder="Ajouter un commentaire..."
								className="flex-1 px-3 py-2 border border-blue-400 rounded-full text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)} // Met à jour l'état du commentaire
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


					{/* Liste des commentaires */}
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

								{/* Username du propriétaire du commentaire */}
								<p className="text-blue-500 text-[10px] italic">
									{comment.userId.username}
								</p>
								{/* Texte du commentaire */}
								<p className="text-gray-700 text-xs italic">
									💬 {comment.text}
								</p>
							</div>
						))}
					</div>



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


		</div >
	);

};

export default TheWorld;