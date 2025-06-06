'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/Button';


export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');


	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

		e.preventDefault();
		setError('');
		setMessage('');

		try {
			const response = await fetch('http://localhost:3000/user/sendforgotPasswordEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage(data.message);
			} else {
				setError(data.message || 'An error occurred while processing your request');
			}
		} catch (error) {
			// console.log('Error during password reset:', error);
			setError(`Network error. Please try again. ${error}`);
		}
	};


	return (
		<div className="max-w-md mx-auto mt-10">

			<h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
			{error && <p className="text-red-500 text-center mb-4">{error}</p>}
			{message && <p className="text-green-500 text-center mb-4">{message}</p>}

			<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
						Email
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="email"
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="flex items-center justify-between">
					<Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white">
						Send Email
					</Button>
					<a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/signin">
						Sign In Page
					</a>
				</div>
			</form>

		</div>
	);
}
