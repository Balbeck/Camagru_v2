'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Button from '@/components/Button';

const ResetEmail = () => {

	const [newEmail, setNewEmail] = useState('');
	const [confirmNewEmail, setConfirmNewEmail] = useState('');

	const router = useRouter();
	const pathname = usePathname();
	const token = pathname.split("/").pop();
	console.log(' 🔐 [ ResetEmail ]Token: ', token);


	useEffect(() => {

		const verifyTokenValidity = async () => {
			console.log(' 🛂 [ResetEmail] token?: ', token)
			if (!token) {
				console.log(' 🛂 [ResetEmail] ❌ token?: ', token)
				router.replace('/');
			}
			try {
				const response = await fetch('http://localhost:3000/user/verifyEmailToken', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ token })
				});

				if (!response.ok) {
					router.replace('/');
				}
			} catch (error) {
				console.error('Erreur lors de la vérification du token:', error);
				router.replace('/');
			}
		}

		verifyTokenValidity();

	}, [token, router]);
	// }, [token]);



	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};


	const handleSubmit = async (e: React.FormEvent) => {

		e.preventDefault();

		if (newEmail !== confirmNewEmail) {
			console.log('Emails do not match.');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/user/resetEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ newEmail, token }),
				credentials: 'include',
			});
			if (response.ok) {
				console.log(' 🛂 [ resetEmail/[token] ] ✅ -> replace(/myGalerie)');
				router.replace('/settings');

			} else {
				console.log(' 🛂 [ resetEmail/[token] ] ❌ -> replace(/)');
				const errorData = await response.json();
				console.log(errorData.message || 'Something went wrong. Try again.');
				alert('Email adress does not match Bro, sry...');
				router.replace('/');
			}

		} catch (error) {
			console.log(' 🛂 [ resetEmail/[token] ] ❌ -> replace(/home): ', error);
			console.log('Error occurred while resetting Email.');
			router.replace('/');
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<h2 className="text-2xl font-bold mb-4 text-center">Confirm your new Email adress</h2>

			{/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}

			<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
						New Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						type="email"
						placeholder="******************"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						required
					/>
					{!validateEmail(newEmail) && newEmail.length > 0 && (
						<p className="text-red-500 text-xs"> ! A FaIrE !! !8 chars Min, 1 uppercase, 1 number, 1 special char.</p>
					)}
				</div>

				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-email">
						Confirm Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="confirm-email"
						type="email"
						placeholder="******************"
						value={confirmNewEmail}
						onChange={(e) => setConfirmNewEmail(e.target.value)}
						required
					/>
					{newEmail !== confirmNewEmail && confirmNewEmail.length > 0 && (
						<p className="text-red-500 text-xs">Emails do not match.</p>
					)}
				</div>

				{validateEmail(newEmail) && newEmail === confirmNewEmail && (
					<div className="flex items-center justify-between">
						<Button type="submit" className="bg-green-500 hover:bg-green-700 text-white">
							Reset Email
						</Button>
					</div>
				)}
			</form>
		</div>
	);
};

export default ResetEmail;