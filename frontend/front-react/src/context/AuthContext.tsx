'use client';

import React, {
	ReactNode,
	useEffect,
	useState,
	createContext,
	useContext
} from 'react';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';


interface AuthContextType {
	isAuthenticated: boolean;
	ft_setAuthTrue: () => void;
	ft_logout: () => void;
}


const tokenName = 'Cama'; // Used to [ ft_Logot ] --> Cookies.remove(tokenName)
const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const pathName = usePathname();

	useEffect(() => {

		if (pathName.startsWith('/resetPassword')) {
			// console.log(' 🙋🏼‍♂️ AuthProvider -> Reject Page /resetPassword ');
			return;
		}

		const checkAuthentification = async () => {
			// console.log(' 🌞 [ AuthContext ] - ...')
			try {
				const response = await fetch('http://localhost:3000/user/checkAuth', {
					method: 'GET',
					credentials: 'include',
				});

				if (response.ok) {
					// console.log(' 🌞 [ AuthContext ] - response.ok ✅ ')
					setIsAuthenticated(true);
				} else {
					// console.log(' 🌞 [ AuthContext ] - response ❌')
					setIsAuthenticated(false);
				}

			} catch (error) {
				console.log(' 🌞 [ AuthContext ] ❌ fetch(/user/checkAuth) -> Error: ', error);
				setIsAuthenticated(false);
			}
		};

		checkAuthentification();

	}, [pathName]);
	// }, []);


	const ft_setAuthTrue = () => {
		setIsAuthenticated(true);
	};


	const ft_logout = async () => {
		// console.log(' 🌞 [ AuthContext ] 🙋🏼‍♂️ ft_logout: Cokies.remove, setAuth:false');
		Cookies.remove(tokenName);
		setIsAuthenticated(false);
	};


	return (

		<AuthContext.Provider value={{ isAuthenticated, ft_setAuthTrue, ft_logout }}>
			{children}
		</AuthContext.Provider>

	);

};
