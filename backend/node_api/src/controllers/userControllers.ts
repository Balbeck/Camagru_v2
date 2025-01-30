import { Request, Response } from 'express';
import * as UserService from '../services/userServices';
import * as AuthJwt from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response) => {
    try {

        console.log('req.body: ', req.body);
        const newUser = await UserService.createUser(req.body);
        console.log(` 🦄 newUser Created: ${newUser.username.toString()} ${newUser._id.toString()}`)
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

};

export const logout = async (req: Request, res: Response) => {

};

export const update_settings = async (req: Request, res: Response) => {

};
