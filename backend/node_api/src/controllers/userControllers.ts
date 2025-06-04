import e, { Request, Response } from 'express';
import * as UserService from '../services/userServices';
import * as AuthJwt from '../middlewares/authMiddleware';
import { findUserByUsername } from '../models/userSchema';

const tokenName: string = "Cama";
const frontUrl: string = process.env.FRONT_URL;

const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    return usernameRegex.test(username);
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!validateUsername(req.body.username)) {
            res.status(400).json({ message: 'Invalid username format' });
            return;
        }
        // console.log(' 🦄 [C]*register ] req.body: ', req.body);
        const newUser = await UserService.createUser(req.body);
        console.log(` 🦄 [C]*register ] ✅ newUser Created: ${newUser.username.toString()} ${newUser._id.toString()}`)

        const email: string = req.body.email;

        const token = AuthJwt.generateJwt(newUser._id.toString());

        await UserService.sendRegisterEmail(email, token);
        res.status(400).json({ message: 'User registered. Please check your email for confirmation.' });

    } catch (error: any) {
        console.log(` 🦄 [C]*register ] ❌ ==> Error message :\n${error.message}`);
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            res.status(400).json({ message: 'Email already in use' });
        }
        else if (error.message === 'USERNAME_ALREADY_EXISTS') {
            res.status(400).json({ message: 'Username already in use' });
        }
        else if (error.message === 'INVALID_PASSWORD') {
            res.status(400).json({ message: 'invalid password' });
        }
        else if (error.message === 'INVALID_EMAIL') {
            res.status(400).json({ message: 'invalid email' });
        }
        else if (error.message === 'EMAIL_SERVICE_ERROR') {
            // Delete User To be sure that only users with Email send are Registred
            const user = await UserService.getUserByEmail(req.body.email);
            UserService.deleteUser(user._id.toString());
            res.status(400).json({ message: 'Please try again later, Gmail Service is unvalable' });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};

// --> [ endpoint for link in Registration Email ] --> send Cookie
export const confirmRegisterEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' ✉️ [C]*confirmEmail ] req.params: ', req.params);
        const { token } = req.params;
        const confirmedUser = await UserService.confirmUserEmail(token);
        console.log(' ✉️ [C]*confirmEmail ] ✅ confirmedUser: \n', confirmedUser);

        res.cookie(tokenName, token, {
            httpOnly: true,
            sameSite: "none",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1j
        });

        res.redirect(301, frontUrl);

    } catch (error) {
        console.log(' ✉️ [C]*confirmEmail ❌ ');
        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ message: 'User not found' });
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
        if (user.emailConfirmed === false) {
            throw new Error('UNCONFIRMED_EMAIL');
        }
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
        } else if (error.message === 'UNCONFIRMED_EMAIL') {
            res.status(404).json({ message: 'unconfirmed email' });
        } else {
            console.log(' 🦄 [C]*Login ] error: ', error);
            res.status(500).json({ message: error.message });
        }
    }
};

// l'email du User est dans req.body.email
export const forgottenPassword = async (req: Request, res: Response): Promise<void> => {
    try {

        console.log(' 🐰 [C]*forgottenPassword ] req.body: ', req.body);
        await UserService.sendResetPasswordEmail(req.body.email);
        res.status(200).json({ message: ' ✉ ⚙ [From Back]  Password reset instructions have been sent to your email.' });

    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

export const verifyEmailToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    try {
        const user = await UserService.verifyTokenToGetEmail(token);
        const email = user.email;
        console.log(' [Ctrl verifyEmailToken]  email: ', email);
        res.json({ email: email });
    } catch (error) {
        console.log('[Ctrl verifyEmailToken] -> ERROR: ', error.message)
        res.status(401).json({ message: "Invalid Token" });
    }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, password, token } = req.body;

    try {
        const updatedUser = await UserService.verifyUpdateNewPassword(email, password, token);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ message: "Error Update New Password" });
    }
};


export const resetEmail = async (req: Request, res: Response): Promise<void> => {
    const { newEmail, token } = req.body;
    try {
        const updatedUser = await UserService.verifyUpdateNewEmail(newEmail, token);
        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        res.status(400).json({ message: "Error Update New Email" });
    }
};


export const sendEmailToChangeUserEmailAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        // [ Verif si email deja used ]
        try {
            const user = await UserService.getUserByEmail(req.body.newEmail);
            if (user) {
                res.status(409).json({ message: 'Email already in use' });
                return;
            }
        } catch (error) {
            if (error.message === 'USER_NOT_FOUND') {
                console.log(' 🐰 [C]*sendEmailToChangeUserEmailAddress ] ✅ Email not found can be USed !: ', req.body.newEmail);
            }
        }

        const userId = req.user.id;
        await UserService.sendEmailToChangeEmailAdress(req.body.newEmail, userId);
        await UserService.updateUserNewEmail(req.user.id.toString(), req.body.newEmail);
        res.status(200).json({ message: ' ✉ ⚙ [From Back]  Email reset instructions have been sent to your Former Email adress Bro !.' });

    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};


export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie(tokenName);
    res.status(201).json({ message: "Déconnexion réussie !" });
};


export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' 🪆 [C]*getMe ] req.user: ', req.user);
        const foundUser = await UserService.getUserById(req.user.id);
        console.log(' 🪆 [C]*getMe ] foundUser: ', foundUser);
        if (!foundUser) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(201).json(foundUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!validateUsername(req.body.username)) {
            res.status(400).json({ message: 'Invalid username format' });
            return;
        }
        const me = await UserService.getUserById(req.user.id);
        if (me.username !== req.body.username) {
            const user = await findUserByUsername(req.body.username);
            if (user) {
                res.status(409).json({ message: 'Username already in use' });
                return;
            }
        }
        console.log(' 🌱 [C]*updateUser ] req.body: ', req.body);
        const updatedUser = await UserService.updateUser(req.user.id, req.body);
        console.log(' 🌱 [C]*updateUser ] updatedUser: ', updatedUser);
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' 🪄 [C]*deleteUser ] req.user: ', req.user);
        const deletedUser = await UserService.deleteUser(req.user.id);
        console.log(' 🪄 [C]*deleteUser ] deletedUser: ', deletedUser);
        res.status(200).json({ message: 'User successfully deleted' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(' 🪄 [C]*updateNotification ] req.body: ', req.body);
        const updatedUser = await UserService.updateCommentNotification(req.user.id, req.body.isNotificationsEnabled);
        console.log(' 🪄 [C]*updateNotification ] updatedUser: ', updatedUser);
        res.status(200);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
