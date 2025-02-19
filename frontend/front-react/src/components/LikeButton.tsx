import React from 'react';

interface LikeButtonProps {
	likes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ likes }) => {
	return (
		<div className="flex items-center space-x-2 text-gray-700 mb-2">
			<span role="img" aria-label="like" className="text-red-500">❤️</span>
			<span>{likes}</span>
		</div>
	);
};

export default LikeButton;
