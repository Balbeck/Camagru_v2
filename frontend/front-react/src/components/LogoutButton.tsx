'use client';

import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';

const LogoutButton = () => {
	const router = useRouter();
	const { logout } = useAuth();

	const handleLogout = async () => {
		try {
			const res = await fetch("http://localhost:3000/user/logout", {
				method: "POST",
				credentials: "include",
			});

			if (res.ok) {
				logout();
				router.replace("/");
			} else {
				console.error("Erreur lors de la déconnexion");
			}
		} catch (error) {
			console.error("Erreur réseau :", error);
		}
	};

	return (
		<button
			onClick={handleLogout}
			className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition"
		>
			Logout
		</button>
	);
};

export default LogoutButton;
