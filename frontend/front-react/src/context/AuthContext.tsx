'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';


interface AuthContextType {
	isAuthenticated: boolean;
	loading: boolean;
	login: () => void;
	logout: () => void;
	checkAuth: () => void;
}

const tokenName = 'Cama';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);



	useEffect(() => {
		console.log(' 🌞 Check Authentification [ On Effect ]')
		const checkAuthentification = async () => {
			try {
				const response = await fetch('http://localhost:3000/user/checkAuth', {
					method: 'GET',
					credentials: 'include', // 🔥 IMPORTANT : envoie les cookies
				});

				if (response.ok) {
					setIsAuthenticated(true);
					setLoading(false);
				} else {
					setIsAuthenticated(false);
					setLoading(false);
				}
			} catch (error) {
				console.error('Erreur lors de la vérification du token:', error);
				setIsAuthenticated(false);
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};

		checkAuthentification();
	}, []);


	const checkAuth = async () => {
		console.log(' 🥭 Check Auth [ on Call ]')
		try {
			const response = await fetch('http://localhost:3000/user/checkAuth', {
				method: 'GET',
				credentials: 'include', // 🔥 IMPORTANT : envoie les cookies
			});

			if (response.ok) {
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		} catch (error) {
			console.error('Erreur lors de la vérification du token:', error);
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	const login = () => {
		setIsAuthenticated(true);
	};


	const logout = async () => {
		Cookies.remove(tokenName);
		setIsAuthenticated(false);
	};


	return (
		<AuthContext.Provider value={{ isAuthenticated, loading, login, logout, checkAuth }}>
			{children}
		</AuthContext.Provider>
	);

};


export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
