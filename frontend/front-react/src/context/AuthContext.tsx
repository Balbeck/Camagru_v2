'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Vérifie l'authentification au chargement (par exemple, vérifie un cookie)
		const token = Cookies.get('authToken');
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const login = () => {
		// Logique de connexion
		setIsAuthenticated(true);
		Cookies.set('authToken', 'dummyToken', { expires: 7 }); // Exemple de token
	};

	const logout = () => {
		// Logique de déconnexion
		setIsAuthenticated(false);
		Cookies.remove('authToken');
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
