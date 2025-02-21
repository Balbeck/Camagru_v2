'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";

interface IPost {
	_id: string;
	userId: string;
	imageUrl: string;
	title?: string;
	likes: string[];
	lastComment?: string;
}

const MyGalerie: React.FC = () => {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const fetchUserPosts = async () => {
			try {
				const response = await fetch('http://localhost:3000/post/getUserPosts', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});

				if (response.ok) {
					const data = await response.json();
					setPosts(data);
				} else {
					console.error('Failed to fetch user posts');
				}
			} catch (error) {
				console.error('Error fetching user posts:', error);
			}
		};

		fetchUserPosts();
	}, []);

	const nextPost = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
	};

	const prevPost = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
	};

	if (posts.length === 0) {
		return <div>Looks Like You never Posted Something \n 😁 Let Try 😁 \nLoading... 🌱</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] relative">
			<h1 className="text-2xl font-bold mb-4 text-white-800">My Gallery</h1>

			{/* Flèche gauche */}
			<button
				className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={prevPost}
			>
				&#8592;
			</button>

			{/* Conteneur du Post */}
			<div className="relative w-[70vw] max-w-[350px] h-[45vh] max-h-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">

				{/* Titre au-dessus de la photo */}
				<div className="w-full bg-white text-gray-900 font-bold text-lg text-center p-2 border-b">
					{posts[currentIndex].title}
				</div>

				{/* Image du post */}
				<div className="relative w-full h-3/4">
					<Image
						src={posts[currentIndex].imageUrl}
						alt={posts[currentIndex].title}
						layout="fill"
						objectFit="cover"
						quality={75}
					/>

					{/* Like en bas à gauche SUR la photo */}
					<div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
						❤️ {posts[currentIndex].likes.length} likes
					</div>
				</div>

				{/* Commentaire en dessous, aligné à gauche */}
				<div className="w-full p-3 text-left">
					<p className="text-gray-700 text-sm italic">💬 {posts[currentIndex].lastComment}</p>
				</div>
			</div>

			{/* Flèche droite */}
			<button
				className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={nextPost}
			>
				&#8594;
			</button>

			{/* Miniatures des photos */}
			<div className="flex flex-wrap justify-center gap-4 mt-8">
				{posts.map((post) => (
					<div key={post._id} className="relative w-[100px] h-[100px] overflow-hidden rounded-lg shadow-md">
						<Image
							src={post.imageUrl}
							alt={post.title}
							layout="fill"
							objectFit="cover"
							quality={75}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default MyGalerie;
