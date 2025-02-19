import React from 'react';

interface CommentProps {
	comment: string;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
	return (
		<div className="text-gray-600 text-sm">
			<p>"{comment}"</p>
		</div>
	);
};

export default Comment;
