'use client';

import React from 'react';
import Image from "next/legacy/image";

import PostHeader from './PostHeader';
import LikeButton from './LikeButton';
import Comment from './Comment';
import { PostProps } from './Interface';


const PostComponent: React.FC<PostProps> = ({ title, photoUrl, likes, lastComment }) => {
	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
			<PostHeader title={title} photoUrl={photoUrl} />
			<div className="relative w-full h-64">
				<Image
					src={photoUrl}
					alt={title}
					className="w-full h-full object-cover rounded-lg border-4 border-white"
					layout="fill"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<div className="p-4">
				<div className="flex justify-between items-center mb-2">
					<LikeButton likes={likes} />
				</div>
				<Comment comment={lastComment} />
			</div>
		</div>
	);
};

export default PostComponent;
