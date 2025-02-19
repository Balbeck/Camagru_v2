// export default function MainPage() {
//     return (
//         <div>
//             <h1>Main Page</h1>
//         </div>
//     );
// }

import React from 'react';
import PostComponent from '@/components/PostComponent';


const GalleryPage: React.FC = () => {
    // Exemple de données de posts
    const posts = [
        {
            id: 1,
            title: 'Mon premier post',
            photoUrl: 'https://via.placeholder.com/640x480',
            likes: 10,
            lastComment: 'Super photo !',
        },
        {
            id: 2,
            title: 'Un autre post',
            photoUrl: 'https://via.placeholder.com/640x480',
            likes: 5,
            lastComment: 'Joli !',
        },
        // Ajoute d'autres posts ici
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Galerie</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostComponent
                        key={post.id}
                        title={post.title}
                        photoUrl={post.photoUrl}
                        likes={post.likes}
                        lastComment={post.lastComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default GalleryPage;
