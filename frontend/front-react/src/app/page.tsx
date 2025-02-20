'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PostComponent from '@/components/PostComponent';


const Home: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();

  // 🚀 Redirection automatique si l'utilisateur est authentifié
  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      router.replace('/theGallery');
    }
  }, [isAuthenticated, router]);

  // 📸 Liste des posts (mock)
  const posts = [
    { id: 1, title: 'Mon premier post', photoUrl: '/pacific_1.jpeg', likes: 10, lastComment: 'Super photo !' },
    { id: 2, title: 'Un autre post', photoUrl: '/pacific_2.jpeg', likes: 5, lastComment: 'Joli !' },
    { id: 3, title: 'Un autre post', photoUrl: '/pacific_3.jpeg', likes: 5, lastComment: 'Quel Paysage !' },
    { id: 4, title: 'Un autre post', photoUrl: '/pacific_4.jpeg', likes: 7, lastComment: 'Quel Paysage Magnifique!' },
    { id: 5, title: 'Un autre post', photoUrl: '/pacific_5.jpeg', likes: 17, lastComment: 'Ouf ! 🌟 ' },
    { id: 6, title: 'Un autre post', photoUrl: '/pacific_6.jpeg', likes: 7, lastComment: 'Bonne Heure ! 🌞 ' },
  ];

  // Si l'utilisateur est authentifié, il sera redirigé donc cette partie ne s'affichera jamais pour lui
  return (
    <div className="text-center">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">The Galerie    Hell🌏  W🌳r🌱d !</h1>
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
    </div >
  );
};

export default Home;
