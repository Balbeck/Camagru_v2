'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';


export default function SignIn() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { ft_setAuthTrue, ft_logout } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        ft_setAuthTrue();
        console.log('🦧 [ SignInPage ] - fetch(login ✅) redir -> /theGallery ');
        router.push('/theWorld');
      } else {
        ft_logout();
        const data = await response.json();
        console.log('🦧 [ SignInPage ] fetch(/user/login) ❌ ');
        setError(data.message || 'An error occurred during sign in');
      }

    } catch (error) {
      console.error('Error during sign in:u ', error);
      setError('Network error. Please try again.');
    }
  };

  return (

    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="Username"
            type="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col items-center space-y-4">

          <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white w-full text-center">
            Sign In
          </Button>

          <div className="flex justify-between w-full text-sm">
            <a className="font-bold text-blue-500 hover:text-blue-800" href="/signup">
              Don&apos;t have an account?
            </a>
            <a className="font-bold text-blue-500 hover:text-blue-800" href="/forgot-password">
              Forgot Password?
            </a>
          </div>

        </div>

      </form>

    </div>
  );
}
