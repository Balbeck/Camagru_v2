'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 🚀 Redirection automatique si l'utilisateur NON authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🌱 [ Header ] redirect to [ Home ] (auth: false !)');
      router.push('/');
      // router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
          CAM📸GRU
        </h1>
        {isAuthenticated ? (
          <div className="flex space-x-4">

            <Button
              href="/uploadImage"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              🧑‍🎨 Upload Image
            </Button>

            <Button
              href="/myGalerie"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              🪆 My Galerie
            </Button>

            <Button
              href="/theWorld"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              🌏 The Galerie
            </Button>
            {/* 
            <Button
              href="/photoBooth"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              📸 Photo Booth
            </Button> */}

            <Button
              href="/settings"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              ⚙️ Settings
            </Button>

            <LogoutButton />

          </div>
        ) : (
          <div className="flex space-x-4">
            <Button
              href="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              Sign Up
            </Button>
            <Button
              href="/signin"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-6 transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
