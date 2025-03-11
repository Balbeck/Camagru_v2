import React from 'react';
import { IComment } from './Interface';


const Comment: React.FC<IComment> = ({ comment }) => {
	return (
		<div className="text-gray-600 text-sm">
			<p>{comment}</p>
		</div>
	);
};

export default Comment;
