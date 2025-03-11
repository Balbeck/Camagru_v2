import React from 'react';
import { ILikeButton } from './Interface';


const LikeButton: React.FC<ILikeButton> = ({ likes }) => {
	return (
		<div className="flex items-center space-x-2 text-gray-700 mb-2">
			<span role="img" aria-label="like" className="text-red-500">❤️</span>
			<span>{likes}</span>
		</div>
	);
};

export default LikeButton;
