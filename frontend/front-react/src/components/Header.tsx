'use client';

import React, { useEffect } from 'react';
import Button from '@/components/Button';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function Header() {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  //   const check = async () => {
  //     console.log('🪆 [ Header ] checkAuth');
  //     await checkAuth(); // ✅ Appelle `checkAuth()` une seule fois après le rendu initial
  //   };
  //   check();
  // }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🪆 [ Header ] redirect to / (auth: false)');
      router.push('/');
    }
  }, [isAuthenticated, router]); // ✅ Se déclenche quand `isAuthenticated` change
  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white animate-pulse flex-grow text-center">
          CAM📸GRU
        </h1>
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <div className="flex space-x-4">
            <Button href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white">
              Sign Up
            </Button>
            <Button href="/signin" className="bg-green-500 hover:bg-green-600 text-white">
              Sign In
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
