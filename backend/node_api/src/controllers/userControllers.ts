import { Request, Response } from 'express';
import * as UserService from '../services/userServices';
import * as AuthJwt from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response) => {
    try {

        console.log(' 🦄 [ register Ctrl ] req.body: ', req.body);
        const newUser = await UserService.createUser(req.body);
        console.log(` 🦄 [ register Ctrl ] newUser Created: ${newUser.username.toString()} ${newUser._id.toString()}`)
        const jwt = AuthJwt.generateJwt(newUser._id.toString());
        res.status(201).json({ newUser, jwt });

    } catch (error: any) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            res.status(400).json({ message: 'Email already in use' });
        } else if (error.message === 'USERNAME_ALREADY_EXISTS') {
            res.status(400).json({ message: 'Username already in use' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};



export const login = async (req: Request, res: Response) => {
    try{
        console.log(' 🦄 [ Login Ctrl ] req.body: ', req.body);
        const user = await UserService.findUserByEmail(req.body.email);
        console.log(` 🦄 [ Login Ctrl ] User Found: ${user.username.toString()} ${user._id.toString()}`);
        // logic pour renvoyer au front le new user + JWT
    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ message: 'User not found' });
        } else if (error.message === 'INVALID_PASSWORD') {
            res.status(400).json({ message: 'Invalid password' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const forgot_password = async (req: Request, res: Response) => {

};

export const logout = async (req: Request, res: Response) => {

};

export const update_user_infos = async (req: Request, res: Response) => {

};
