"use client";

import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { IUser } from "@/components/Interface";


export default function SettingsPage() {

	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [profilePicture, setProfilePicture] = useState<File | null>(null);

	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState("");

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
				setBio(data.bio || "");
				// Vérifier si l'URL de profilePicture est complète ou relative
				const profileUrl = data.profilePicture?.startsWith("http")
					? data.profilePicture : `/${data.profilePicture}`;
				setPreview(profileUrl);

			} catch {
				alert('Impossible de charger les données utilisateur');
				console.log('🗂️ [ Settings ] catch - redirect to [ Home ]')
				router.push("/");
			}
		};

		fetchUserData();

	}, [router]);


	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setProfilePicture(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		// Serialize form data into JSON
		const formData = {
			username,
			bio,
			profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : null,
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

			if (!response.ok) {
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

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-bold mb-4 text-gray-900">Modifier le profil</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Preview Image */}
				<div className="flex flex-col items-center">
					{preview ? (
						<Image
							src={preview}
							alt="Profile Preview"
							width={128}
							height={128}
							className="rounded-full object-cover border border-gray-300"
						/>
					) : (
						<Image
							src="/default_profile_picture.jpg"
							alt="Default Profile"
							width={128}
							height={128}
							className="rounded-full object-cover border border-gray-300"
						/>
					)}
					<input type="file" accept="/*" onChange={handleFileChange} className="mt-2" />
				</div>

				{/* Username */}
				<div>
					<label className="block font-semibold text-gray-900">Nom d&apos;utilisateur</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full p-2 border rounded-md"
					/>
				</div>

				{/* Bio */}
				<div>
					<label className="block font-semibold text-gray-900">Bio</label>
					<textarea
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						className="w-full p-2 border rounded-md"
					></textarea>
				</div>

				{/* Bouton Save */}
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
					Sauvegarder
				</button>
				<div className="flex justify-between w-full text-sm">
					<a className="font-bold text-blue-500 hover:text-blue-800" href="/forgot-password">
						Change your Password
					</a>
				</div>
			</form>
		</div>
	);
}
