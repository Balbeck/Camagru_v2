"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/components/Interface";


export default function SettingsPage() {

	const [username, setUsername] = useState("");
	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [currentEmail, setCurrentEmail] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState("");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newEmail, setNewEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);

	const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

	const router = useRouter();


	useEffect(() => {

		const fetchUserData = async () => {

			try {
				console.log('🗂️ [ Settings ] useEffect() - fetch /user/me');
				const response = await fetch("http://localhost:3000/user/me", {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					console.log('🗂️ [ Settings ] - fetch /user/me ❌');
					throw new Error("Erreur lors du chargement des infos");
				}

				console.log('🗂️ [ Settings ] - fetch /user/me ✅');
				const data: IUser = await response.json();
				setUsername(data.username);
				setCurrentEmail(data.email);
				setBio(data.bio || "");
				setIsNotificationsEnabled(data.isNotificationsEnabled);


			} catch {
				alert('Impossible de charger les données utilisateur');
				console.log('🗂️ [ Settings ] catch - redirect to [ Home ]')
				router.push("/");
			}
		};

		fetchUserData();

	}, [router]);


	const validateUsername = (username: string): boolean => {
		const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
		return usernameRegex.test(username);
	};

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setUsername(value);
		setIsUsernameValid(validateUsername(value));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		const formData = {
			username,
			bio,
		};

		try {
			const response = await fetch("http://localhost:3000/user/updateUser", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.status === 409) {
				alert('This username is already in use. Please try another one.');
				setUsername("");
			}
			else if (!response.ok) {
				throw new Error("Erreur lors de la mise à jour");
			} else {
				alert("Profil mis à jour avec succès !");
			}
		} catch (err) {
			setError(`Échec de la mise à jour: ${err}`);
		}
	};

	if (error) {
		return <p className="text-red-500 text-center">{error}</p>;
	}



	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewEmail(value);
		setIsEmailValid(validateEmail(value));
	};

	const handleSendEmail = async () => {
		if (isEmailValid) {
			const response = await fetch("http://localhost:3000/user/sendChangeEmailAdressEmail", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ newEmail }),
			});
			if (response.status === 409) {
				console.log(' 🛂 [ resetEmail/[token] ] ❌ -> Conflict (409)');
				alert('This email is already in use. Please try another one.');
				setNewEmail("");

			}
			else if (!response.ok) {
				alert("Erreur lors de l'envoi de l'e-mail de confirmation");

			} else {
				setNewEmail("");
				setIsEmailValid(false);
				alert(`Un e-mail de confirmation a été envoyé à Votre adresse Email Originale !`);
				setNewEmail("");
				setIsModalOpen(false);
			}
		};
	}

	const handleNotificationChange = async () => {
		try {
			setIsNotificationsEnabled((prev) => !prev);
			const response = await fetch("http://localhost:3000/user/updateNotification", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isNotificationsEnabled: !isNotificationsEnabled }),
			});
			if (!response.ok) {
				throw new Error("Erreur lors de la mise à jour des notifications");
			}

		} catch (error) {
			alert('Erreur lors de la mise à jour des notifications');
			void error;
		}
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-bold mb-4 text-gray-900">Modifier le profil</h2>

			<form onSubmit={handleSubmit} className="space-y-4">

				{/* Username */}
				<div>
					<label className="block font-semibold text-gray-900">Nom d&apos;utilisateur</label>
					<input
						id="username"
						type="text"
						placeholder="Username"
						value={username}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						onChange={handleUsernameChange}
						required
					/>
					{/* Error conditionnelle */}
					{!validateUsername(username) && username.length > 0 && (
						<p className="text-red-500 text-xs">3 to 16 chars ltr, nbr, &apos;_&apos; and &apos;-&apos; only.</p>
					)}
				</div>
				{/* Email */}
				<div>
					<label className="block font-semibold text-gray-900">Email</label>
					<input
						type="text"
						value={currentEmail}
						readOnly // Rend champ non modifiable
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
					/>
				</div>
				{/* Bio */}
				<div>
					<label className="block font-semibold text-gray-900">Bio</label>
					<textarea
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					></textarea>
				</div>

				{/* Notif Comment Switch Button */}
				<div>
					<div className="flex items-center space-x-3">
						<label className="block font-semibold text-gray-900">Email Notification</label>
						<div
							className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${isNotificationsEnabled ? "bg-green-500" : "bg-gray-300"
								}`}
							onClick={handleNotificationChange}
						>
							<div
								className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${isNotificationsEnabled ? "translate-x-6" : "translate-x-0"
									}`}
							></div>
						</div>
					</div>
				</div>

				<button
					type="submit"
					disabled={!isUsernameValid}
					className={`w-full py-3 rounded-lg text-white font-semibold transition ${isUsernameValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
						}`}
				>
					Save
				</button>


				<div className="flex justify-between w-full text-sm">
					<a className="font-bold text-blue-500 hover:text-blue-800" href="/forgot-password">
						Change your Password
					</a>
					<a
						className="font-bold text-blue-500 hover:text-blue-800 cursor-pointer"
						onClick={() => {
							setIsModalOpen(true);
							setNewEmail("");
						}}
					>
						Change your Email
					</a>
				</div>
			</form>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative">
						{/* Bouton close */}
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
						>
							✕
						</button>

						<h3 className="text-lg font-bold mb-4 text-gray-900">
							Enter your new Email address
						</h3>

						<input
							type="email"
							placeholder="email"
							value={newEmail}
							onChange={handleEmailChange}
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-black"
						/>

						<button
							onClick={handleSendEmail}
							disabled={!isEmailValid}
							className={`w-full py-3 rounded-lg text-white font-semibold transition ${isEmailValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
								}`}
						>
							Send Confirmation Email
						</button>

						<button
							onClick={() => setIsModalOpen(false)}
							className="w-full mt-3 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
