'use client';

import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';


const LogoutButton = () => {

	const router = useRouter();
	const { ft_logout } = useAuth();


	const handleLogout = async () => {
		try {

			const res = await fetch('http://localhost:3000/user/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (res.ok) {
				ft_logout();
				console.log(' 🙋🏼 [ LogOut ] router.replace("/")')
				router.replace("/");
				// router.push("/");
			} else {
				console.error(' 🙋🏼 [ LogOut ] ❌ Erreur déconnexion');
			}
		} catch (error) {
			console.error(' 🙋🏼 [ LogOut ] ❌ Error: ', error);
		}
	};


	return (
		<button
			onClick={handleLogout}
			className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition'
		>
			Logout
		</button>
	);

};


export default LogoutButton;
