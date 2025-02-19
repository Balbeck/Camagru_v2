import React from 'react';
import Image from 'next/image';

import PostHeader from './PostHeader';
import LikeButton from './LikeButton';
import Comment from './Comment';

interface PostProps {
	title: string;
	photoUrl: string;
	likes: number;
	lastComment: string;
}

const Post: React.FC<PostProps> = ({ title, photoUrl, likes, lastComment }) => {
	return (
		<div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
			<PostHeader title={title} photoUrl={photoUrl} />
			<Image
				src={photoUrl}
				alt={title}
				className="w-full h-64 object-cover"
				width={600} // Adjust the width as needed
				height={300} // Adjust the height as needed
			/>
			<div className="p-4">
				<LikeButton likes={likes} />
				<Comment comment={lastComment.replace(/"/g, '&quot;')} />
			</div>
		</div>
	);
};

export default Post;
