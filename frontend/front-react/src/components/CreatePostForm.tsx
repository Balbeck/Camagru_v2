'use client';

import React, { useState } from "react";


const CreatePost = ({ data, onPublish }) => {

	const [title, setTitle] = useState("Mon premier Post 🌞");

	const handlePublish = async () => {

		if (!title.trim()) {
			alert("Le titre ne peut pas être vide !");
			return;
		}

		const newPost = { title: title, image: data };
		onPublish(newPost);
	};


	return (
		<div className="relative w-full flex flex-col items-center">
			{/* Titre modifiable */}
			<input
				type="text"
				className="w-full bg-white text-gray-900 font-bold text-lg text-center p-2 border-b outline-none"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>

			{/* Image du post */}
			<div className="relative w-full h-3/4 mt-2">
				<img
					src={data}
					alt="Prévisualisation du post"
					className="object-cover w-full h-full rounded-md"
				/>
			</div>

			{/* Bouton Publish */}
			<button
				className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md w-full"
				onClick={handlePublish}
			>
				Publish
			</button>
		</div>
	);
};

export default CreatePost;
