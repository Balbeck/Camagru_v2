import React from 'react';

interface PostHeaderProps {
	title: string;
	photoUrl: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ title }) => {
	return (
		<div className="p-4 border-b">
			<h2 className="text-lg font-semibold text-gray-900">{title}</h2>
		</div>
	);
};

export default PostHeader;
