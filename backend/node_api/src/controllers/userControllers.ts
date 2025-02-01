import { Request, Response } from 'express';
import cookie from 'cookie';
import * as UserService from '../services/userServices';
import * as AuthJwt from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response) => {
    try {

        console.log(' 🦄 [ register Ctrl ] req.body: ', req.body);
        const newUser = await UserService.createUser(req.body);
        console.log(` 🦄 [ register Ctrl ] newUser Created: ${newUser.username.toString()} ${newUser._id.toString()}`)
        
        const jwt = AuthJwt.generateJwt(newUser._id.toString());

        res.setHeader('Set-Cookie', cookie.serialize('token', jwt, {
            httpOnly: true,  // Empêche l'accès par JavaScript
            maxAge: 60 * 60,  // Durée de validité (1 heure ici)
            path: '/',
            sameSite: 'strict'  // Sécurise le cookie contre CSRF
          }));
        res.status(201).json({ message: 'User created and authentified' });

    } catch (error: any) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            res.status(400).json({ message: 'Email already in use' });
        } else if (error.message === 'USERNAME_ALREADY_EXISTS') {
            res.status(400).json({ message: 'Username already in use' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};



export const login = async (req: Request, res: Response) => {
    try{
        console.log(' 🦄 [ Login Ctrl ] req.body: ', req.body);
        const user = await UserService.findUserByEmail(req.body);
        console.log(` 🦄 [ Login Ctrl ] User Found: ${user.username.toString()} ${user._id.toString()}`);
        
        const jwt = AuthJwt.generateJwt(user._id.toString());
        
        res.setHeader('Set-Cookie', cookie.serialize('token', jwt, {
            httpOnly: true,  // Empêche l'accès par JavaScript
            maxAge: 60 * 60,  // Durée de validité (1 heure ici)
            path: '/',
            sameSite: 'strict'  // Sécurise le cookie contre CSRF
          }));
        res.status(201).json({ message: 'User authentified' });
    
    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ message: 'User not found' });
        } else if (error.message === 'INVALID_PASSWORD') {
            res.status(400).json({ message: 'Invalid password' });
        } else {
            console.log(' 🦄 [ Login Ctrl ] error: ', error);
            res.status(500).json({ message: error.message });
        }
    }
};

export const forgot_password = async (req: Request, res: Response) => {

};

export const logout = async (req: Request, res: Response) => {

};

export const update_user_infos = async (req: Request, res: Response) => {

};
