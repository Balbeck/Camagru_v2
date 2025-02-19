import React from 'react';
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
			<img src={photoUrl} alt={title} className="w-full h-64 object-cover" />
			<div className="p-4">
				<LikeButton likes={likes} />
				<Comment comment={lastComment} />
			</div>
		</div>
	);
};

export default Post;
