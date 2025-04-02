'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';

const ResetPassword = () => {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Recup token from URL


  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };



  useEffect(() => {

    console.log(' 🛂 [ResetPass] token?: ', token)

    if (!token) {
      console.log(' 🛂 [ResetPass] ❌ token?: ', token)
      console.log('Invalid or missing token.');
      router.replace('/');
    }

  }, [token, router]);



  // *[ A Faire ]*

  // *[ Fetch Back pour verifier validity du JWT ]*
  // *[ Si fetch response.ok -> affichage form de resetPassword ]*
  // *[ Si fetch !response.ok -> message error -> button reset password pour renvoyer emailavec token dans URL ]*

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, token }),
        credentials: 'include',
      });
      if (response.ok) {
        // setMessage('Password successfully reset!');
        console.log(' 🛂 [ resetPass/[token] ] ✅ -> replace(/myGalerie)');
        router.replace('/myGalerie');
      }

      else {
        console.log(' 🛂 [ resetPass/[token] ] ❌ -> replace(/)');
        const errorData = await response.json();
        console.log(errorData.message || 'Something went wrong. Try again.');
        router.replace('/');
      }

    } catch (error) {
      console.log(' 🛂 [ resetPass/[token] ] ❌ -> replace(/home): ', error);
      console.log('Error occurred while resetting password.');
      router.replace('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

      {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

        <div className="mb-4">
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
          {!validatePassword(password) && password.length > 0 && (
            <p className="text-red-500 text-xs">8 chars Min, 1 uppercase, 1 number, 1 special char.</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type="password"
            placeholder="******************"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" className="bg-green-500 hover:bg-green-700 text-white">
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
