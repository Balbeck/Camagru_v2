// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from "next/legacy/image";

// import { useAuth } from '@/context/AuthContext';
// // import PostComponent from '@/components/PostComponent';


// // 📸 Liste des posts (mock)
// const posts = [
//   { id: 5, title: 'Un autre post', photoUrl: '/pacific_5.jpeg', likes: 17, lastComment: 'Ouf ! 🌟 ' },
//   { id: 1, title: 'Mon premier post', photoUrl: '/pacific_1.jpeg', likes: 10, lastComment: 'Super photo !' },
//   { id: 2, title: 'Un autre post', photoUrl: '/pacific_2.jpeg', likes: 5, lastComment: 'Joli !' },
//   { id: 4, title: 'Un autre post', photoUrl: '/pacific_4.jpeg', likes: 7, lastComment: 'Quel Paysage Magnifique!' },
//   { id: 3, title: 'Un autre post', photoUrl: '/pacific_3.jpeg', likes: 5, lastComment: 'Quel Paysage !' },
//   { id: 6, title: 'Un autre post', photoUrl: '/pacific_6.jpeg', likes: 7, lastComment: 'Bonne Heure ! 🌞 ' },
// ];


// const Home: React.FC = () => {

//   const router = useRouter();
//   const { isAuthenticated } = useAuth();


//   useEffect(() => {
//     // 🚀 Redirection automatique si l'utilisateur est authentifié
//     if (isAuthenticated) {
//       console.log('🌳 [ Home ] redirect to [ theGallery ] (auth: True !)');
//       // router.push('/theWorld');
//       router.replace('/theWorld');
//     }
//   }, [isAuthenticated, router]);


//   // 🌀 États pour gérer le carrousel (index du post affiché)
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const totalPosts = posts.length;

//   // Fonction pour passer au post suivant
//   const nextPost = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPosts);
//   };

//   // Fonction pour passer au post précédent
//   const prevPost = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPosts) % totalPosts);
//   };


//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
//       <h1 className="text-2xl font-bold mb-4 text-white-800">The Galerie Hell🌏 W🌳r🌱d !</h1>

//       {/* Flèche gauche */}
//       <button
//         className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
//         onClick={prevPost}
//       >
//         &#8592;
//       </button>

//       {/* Conteneur du Post */}
//       <div className="relative w-[70vw] max-w-[350px] h-[45vh] max-h-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">

//         {/* Titre au-dessus de la photo */}
//         <div className="w-full bg-white text-gray-900 font-bold text-lg text-center p-2 border-b">
//           {posts[currentIndex].title}
//         </div>

//         {/* Image du post */}
//         <div className="relative w-full h-3/4">
//           <Image
//             src={posts[currentIndex].photoUrl}
//             alt={posts[currentIndex].title}
//             layout="fill"
//             objectFit="cover"
//             quality={75}
//           />

//           {/* Like en bas à gauche SUR la photo */}
//           <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
//             ❤️ {posts[currentIndex].likes} likes
//           </div>
//         </div>

//         {/* Commentaire en dessous, aligné à gauche */}
//         <div className="w-full p-3 text-left">
//           <p className="text-gray-700 text-sm italic">💬 {posts[currentIndex].lastComment}</p>
//         </div>
//       </div>

//       {/* Flèche droite */}
//       <button
//         className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
//         onClick={nextPost}
//       >
//         &#8594;
//       </button>
//     </div >
//   );

// };


// export default Home;









'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/legacy/image";


export interface IPostData {
	_id: string;
	userId: {
		_id: string,
		username: string
	};
	imageId: { data: string };
	title: string;
	createdAt: string;
	likes: {
		nbr_likes: number,
		didILikeIt: boolean
	};
	comments: {
		_id: string,
		userId: {
			_id: string,
			username: string
		},
		text: string,
		createdAt: string
	}[];
};

const Home: React.FC = () => {

    const fetchPosts = async (page: number) => {

        try {
            const response = await fetch(`http://localhost:3000/post/getAllPublic?page=${page}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setPosts((prevPosts) => [...prevPosts, ...data.posts]);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
                console.log('🌏 [ AllPosts ] fetchPosts - postsData: \n', data);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };


	const [posts, setPosts] = useState<IPostData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

 
    useEffect(() => {
        fetchPosts(currentPage);
    },[] );


	const nextPost = () => {
        const nextIndex = currentIndex + 1;

        // Charge nextPosts sur affichage dde l'avant dernier
        if (nextIndex === posts.length - 2 && currentPage < totalPages) {
            fetchPosts(currentPage + 1);
        }

    
        if (nextIndex >= posts.length) {
            setCurrentIndex(0); //infinite carousel 
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    const prevPost = () => {
        const prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
            setCurrentIndex(posts.length - 1); // infinite carrousel
        } else {
            setCurrentIndex(prevIndex);
        }
    };








	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] relative">
			<h1 className="text-2xl font-bold mb-4 text-white-800">The W🌏rld !</h1>


			{/* Flèche gauche - Ne 'affiche au 1er post que si l'ensemble des post ont ete load !*/}
			{!(currentIndex === 0 && currentPage < totalPages) && (
			    <button
			        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
			        onClick={prevPost}
			    >
			        &#8592;
			    </button>
			)}



			{/* Conteneur du Post */}
			{posts.length > 0 ? (
				<div className="relative w-[70vw] max-w-[350px] flex flex-col items-center bg-white shadow-2xl rounded-xl overflow-hidden my-3">

					{/* Titre au-dessus de la photo */}
					<div className="w-full bg-white text-gray-900 font-bold text-lg text-center p-2 border-b">
						{posts[currentIndex]?.title}
					</div>

					{/* Image du post */}
					<div className="relative w-full max-h-[250px] aspect-[4/5]">
						<Image
							src={posts[currentIndex]?.imageId?.data}
							alt={posts[currentIndex]?.title}
							layout="fill"
							objectFit="cover"
							quality={75}
						/>


            {/* Like en bas à gauche SUR la photo */}
           <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
			 ❤️ {posts[currentIndex].likes.nbr_likes} likes
           </div>
         


         

						{/* username en bas à droite SUR la photo */}
						<div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm">
							{posts[currentIndex].userId.username}
						</div>	
</div>

				{/* Liste des commentaires */}
					<div className="w-full p-3 text-left">
						{posts[currentIndex].comments.map((comment) => (
							<div key={comment._id} className="relative mb-4">

								{/* Username du propriétaire du commentaire */}
								<p className="text-blue-500 text-[10px] italic">
									{comment.userId.username}
								</p>
								{/* Texte du commentaire */}
								<p className="text-gray-700 text-xs italic">
									💬 {comment.text}
								</p>
							</div>
						))}
					</div>



				</div>

			) : (
				<p className="text-gray-500">Aucun post à afficher.</p>
			)}

			{/* Flèche droite */}
			<button
				className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-5 rounded-full shadow-lg z-20 opacity-90 hover:opacity-100 transition hover:scale-110"
				onClick={nextPost}
			>
				&#8594;
			</button>


		</div >
	);

};

export default Home;