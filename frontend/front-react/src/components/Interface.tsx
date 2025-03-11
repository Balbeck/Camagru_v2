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
	image: string;
}

export interface ICreatePost {
	data: string;
	onPublish: (newPost: { title: string, image: string }) => void
}

export interface IUser {
	username: string;
	profilePicture: string;
	bio?: string;
}

export interface PostProps {
	title: string;
	photoUrl: string;
	likes: number;
	lastComment: string;
}

export interface IPost {
	_id: string;           // Identifiant unique du post (généralement un ObjectId)
	userId: string;        // Identifiant de l'utilisateur ayant posté (généralement un ObjectId)
	imageUrl: string;      // L'URL de l'image du post
	title: string;        // Le titre du post (optionnel, car il peut ne pas être défini)
	createdAt: string;     // Date de création (en format ISO string)
	updatedAt: string;     // Date de mise à jour (en format ISO string)
	// likes: string[];       // Liste des identifiants des utilisateurs ayant aimé le post
	// comments?: {           // Liste des commentaires sur le post (optionnelle)
	//   _id: string;         // Identifiant unique du commentaire
	//   userId: string;      // Identifiant de l'utilisateur ayant posté le commentaire
	//   text: string;        // Le texte du commentaire
	//   createdAt: string;   // Date de création du commentaire
	// }[];                   // Tableau des commentaires
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

