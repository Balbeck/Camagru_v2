export interface IImage {
	_id: string;
	userId: string;
	filename: string;
	contentType: string;
	data: string;
	createdAt: Date;
}

export interface IPostData {
	title: string;
	imageId: string;
}

export interface ICreatePost {
	data: string;
	imageId: string;
	onPublish: (newPost: { title: string, imageId: string }) => void
}

export interface IUser {
	username: string;
	email: string;
	profilePicture: string;
	bio?: string;
	isNotificationsEnabled: boolean;
}

export interface PostProps {
	title: string;
	photoUrl: string;
	likes: number;
	lastComment: string;
}

export interface IPost {
	imageId: IImage;
	_id: string;
	userId: string;
	imageUrl: string;
	title: string;
	createdAt: string;
	updatedAt: string;
}

export interface IButton {
	href?: string;
	children: React.ReactNode;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
}

export interface IComment {
	comment: string;
}

export interface ILikeButton {
	likes: number;
}

