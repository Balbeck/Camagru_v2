import { Request, Response } from 'express';
import * as UserService from '../services/userServices';
import * as AuthJwt from '../middlewares/authMiddleware';

const tokenName: string = "Cama";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {

        console.log(' 🦄 [C]*register ] req.body: ', req.body);
        const newUser = await UserService.createUser(req.body);
        console.log(` 🦄 [C]*register ] newUser Created: ${newUser.username.toString()} ${newUser._id.toString()}`)

        const token = AuthJwt.generateJwt(newUser._id.toString());
        res.cookie(tokenName, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1j
        });

        res.status(201).json({ message: 'User created and authentified', jwt: token });

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



export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' 🦄 [C]*Login ] req.body: ', req.body);
        const user = await UserService.logInUser(req.body);
        console.log(` 🦄 [C]*Login ] User Found: ${user.username.toString()} ${user._id.toString()}`);

        const token = AuthJwt.generateJwt(user._id.toString());
        res.cookie(tokenName, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1j
        });

        res.status(201).json({ message: 'User authentified', jwt: token });

    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ message: 'User not found' });
        } else if (error.message === 'INVALID_PASSWORD') {
            res.status(404).json({ message: 'Invalid password' });
        } else {
            console.log(' 🦄 [C]*Login ] error: ', error);
            res.status(500).json({ message: error.message });
        }
    }
};



export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie(tokenName);
    res.status(201);
    res.json({ message: "Déconnexion réussie !" });
};


export const get_me = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' 🪆 [C]*getMe ] req.user: ', req.user);
        const foundUser = await UserService.getUserById(req.user.id);
        console.log(' 🪆 [C]*getMe ] foundUser: ', foundUser);
        if (!foundUser) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(201).json(foundUser);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


export const forgot_password = async (req: Request, res: Response) => {

};



export const update_infos = async (req: Request, res: Response) => {
    try {
        console.log(' 🌱 [C]*Up_Infos ] req.body: ', req.body);
        console.log(' 🌱 [C]*Up_Infos ] req.user: ', req.user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
