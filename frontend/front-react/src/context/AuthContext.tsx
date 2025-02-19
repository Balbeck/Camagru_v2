'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
	isAuthenticated: boolean;
	loading: boolean;
	login: () => void;
	logout: () => void;
}

const tokenName = 'Cama';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		const token = Cookies.get(tokenName);
		if (token) {
			setIsAuthenticated(true);
		}
		setLoading(false);
	}, []);


	const login = () => {
		setIsAuthenticated(true);
	};


	const logout = async () => {
		Cookies.remove(tokenName);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
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
