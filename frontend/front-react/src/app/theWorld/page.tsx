'use client';

import React, { useEffect, useState } from 'react';

import PostComponent from '@/components/PostComponent';
import { IPost } from '@/components/Interface';



const TheWorldPage: React.FC = () => {

    // // Exemple de données de posts
    // const posts = [
    //     {
    //         id: 1,
    //         title: 'Mon premier post',
    //         photoUrl: '/pacific_1.jpeg',
    //         likes: 10,
    //         lastComment: 'Super photo !',
    //     },
    //     {
    //         id: 2,
    //         title: 'Un autre post',
    //         photoUrl: '/pacific_2.jpeg',
    //         likes: 5,
    //         lastComment: 'Joli !',
    //     },
    //     {
    //         id: 3,
    //         title: 'Un autre post',
    //         photoUrl: '/pacific_3.jpeg',
    //         likes: 5,
    //         lastComment: 'Quel Paysage !',
    //     },
    //     {
    //         id: 4,
    //         title: 'Un autre post',
    //         photoUrl: '/pacific_4.jpeg',
    //         likes: 7,
    //         lastComment: 'Quel Paysage Magnifique!',
    //     },
    //     {
    //         id: 5,
    //         title: 'Un autre post',
    //         photoUrl: '/pacific_5.jpeg',
    //         likes: 17,
    //         lastComment: 'Ouf ! 🌟 ',
    //     },
    //     {
    //         id: 6,
    //         title: 'Un autre post',
    //         photoUrl: '/pacific_6.jpeg',
    //         likes: 7,
    //         lastComment: 'Bonne Heure ! 🌞 ',
    //     },
    //     // Ajoute d'autres posts ici
    // ];

    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {

        const fetchAllPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/post/getAll', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const postsData = await response.json();
                    console.log('🌳 [ TheWorldPage ] fetchAllPosts - postsData: ', postsData);
                    setPosts(postsData);
                } else {
                    console.error('Failed to fetch user images');
                }
            } catch (error) {
                console.error('Error fetching user images:', error);
            }
        };

        fetchAllPosts();

    }, []);


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">The Galerie</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostComponent
                        key={post._id}
                        title={post.title}
                        // photoUrl={post.imageUrl}
                        photoUrl={post.imageId?.data}
                        // likes={post.likes}
                        // lastComment={post.lastComment}
                        likes={10}
                        lastComment={'lastComment Boby !'}
                    />
                ))}
            </div>
        </div>
    );

};


export default TheWorldPage;
