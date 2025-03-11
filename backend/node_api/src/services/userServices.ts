import bcrypt from 'bcryptjs';
import { confirmUserEmailStatusbyUserId, deleteUserByUserId, findUserById, IUser, updateUserById, User } from '../models/userSchema'
import { createNewUser, findUserByEmail, findUserByUsername } from '../models/userSchema';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendConfirmationEmail = async (userEmail: string, token: string) => {
    const server_host = process.env.SERVER_HOST
    const server_port = process.env.SERVER_PORT
    const link: string = `${server_host}:${server_port}/user/confirmEmail/${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Confirm Your Email for Camagru 42 🪆',
        text: `Please confirm your email by clicking on the following link: ${link}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(' ✉️ [S]sendEmail: ✅ Email sent successfully');
    } catch (error) {
        console.log(' ✉️ [S]sendEmail: ❌ ERROR Email sent ');
        throw new Error('EMAIL_SERVICE_ERROR');
    }
};

export const createUser = async (body: any): Promise<IUser> => {
    try {
        // - -[ * User * Verifications ]- -
        const existingUserByEmail = await findUserByEmail(body.email);
        const existingUserByUsername = await findUserByUsername(body.username);
        if (existingUserByEmail) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        if (existingUserByUsername) {
            throw new Error('USERNAME_ALREADY_EXISTS');
        }
        console.log(` 🥝 [S]*createU ] User: ${body.username}, ${body.email}:  [ Doesnt already exist ! ]`)

        // - -[ * Hash * Password ]- -
        const pass: string = body.password;
        console.log(` 🥝 [S]*createU ] body.password: ${pass}`);
        const hashedPassword: string = await bcrypt.hash(pass, 10);

        // - -[ * User * Creation ]- -
        const newUser = await createNewUser(body.username, body.email, hashedPassword);
        console.log(" 🥝 [S]*createU ] ✅ User created successfully: ", newUser);

        return newUser;

    } catch (error) {
        // console.error("❌ Error User Creation: ", error.message);
        console.log("❌ Error User Creation: ", error.message);
        throw error;
    }
};


export const logInUser = async (body: any): Promise<IUser> => {
    try {
        // - -[ * User * Verifications ]- -
        const existingUserByEmail = await findUserByEmail(body.email);
        if (!existingUserByEmail) {
            throw new Error('USER_NOT_FOUND')
        }
        console.log(` 🚀 [S]*logInU ] UserFound: ${existingUserByEmail.email}`);

        // - -[ * Hash * Comparison ]- -
        const hashComparison = await bcrypt.compare(body.password, existingUserByEmail.passwordHash);
        if (!hashComparison) {
            console.log(` 🚀 [S]*logInU ] Hash Comparison ❌ `);
            throw new Error('INVALID_PASSWORD');
        }
        console.log(` 🚀 [S]*logInU ] Hash Comparison ✅ `);

        return existingUserByEmail;

    } catch (error) {
        console.log("❌ Error LogIn User: ", error.message);
        throw error;
    }
};


export const getUserById = async (userId_string: string): Promise<IUser> => {
    try {
        console.log(' 📗 [S]*getUserById ] userId_string: ', userId_string);
        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(userId_string)) {
            throw new Error('INVALID_USER_ID');
        }

        const userId = new mongoose.Types.ObjectId(userId_string);
        const user: IUser = await findUserById(userId);
        console.log(' 📗 [S]*getUserById ] userFound ✅ id: ', user._id);

        return user;

    } catch (error) {
        console.log(' ❌ [S]*getUserById ] userId_string: ', userId_string);
        throw error;
    }
};


export const getUserByEmail = async (userEmail: string): Promise<IUser> => {
    try {
        console.log(' 📗 [S]*getUserById ] userEmail_string: ', userEmail);
        // const user: IUser = await findUserByEmail(userEmail);
        const user: IUser = await User.findOne({ email: userEmail }).exec();
        console.log(' 📗 [S]*getUserByEmail ] userFound ✅ id: ', user._id);

        return user;

    } catch (error) {
        console.log(' ❌ [S]*getUserByEmail ] userEmail: ', userEmail);
        throw error;
    }
};


export const updateUser = async (userId_string: string, updates: Partial<IUser>): Promise<IUser> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId_string)) {
            throw new Error('INVALID_USER_ID');
        }

        const userId = new mongoose.Types.ObjectId(userId_string);
        const updatedUser = await updateUserById(userId, updates);
        console.log(' 📗 [S]*updateUser ] updatedUser: ', updatedUser);

        return updatedUser;

    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId_string: string): Promise<IUser> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId_string)) {
            throw new Error('INVALID_USER_ID');
        }

        const userId = new mongoose.Types.ObjectId(userId_string);
        const deletedUser = await deleteUserByUserId(userId);

        return deletedUser;

    } catch (error) {
        throw error;
    }
};

export const confirmUserEmail = async (token: string): Promise<IUser> => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        console.log(' ✉️ [S]confirmEmail ] decoded: ', decoded);
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            throw new Error('INVALID_USER_ID');
        }
        const userId = new mongoose.Types.ObjectId(decoded.id);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return await confirmUserEmailStatusbyUserId(user._id);

    } catch (error) {
        throw error;
    }
};
