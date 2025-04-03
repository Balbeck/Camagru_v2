import bcrypt from 'bcryptjs';
import { confirmUserEmailStatusbyUserId, deleteUserByUserId, findUserById, IUser, updateUserById, User } from '../models/userSchema'
import { createNewUser, findUserByEmail, findUserByUsername } from '../models/userSchema';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// - - - - - - - - - [ Fcts - EMAIL - Services ] - - - - - - - - -

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendRegisterEmail = async (userEmail: string, token: string) => {
    const server_host = process.env.SERVER_HOST
    const server_port = process.env.SERVER_PORT
    const link: string = `${server_host}:${server_port}/user/confirmRegisterEmail/${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Confirm Your Email for Camagru 42 🪆',
        text: `Please confirm your email by clicking on the following link: ${link}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(' ✉️ [S]registerEmail: ✅ Email sent ');

    } catch (error) {
        console.log(' ✉️ [S]registerEmail: ❌ ERROR Email sent ');
        throw new Error('EMAIL_SERVICE_ERROR');
    }
};


export const sendConfirmationEmailforChangedPassword = async (userEmail: string) => {
    const server_host = process.env.SERVER_HOST
    const server_port = process.env.SERVER_PORT
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Password Changed for Camagru 42 🪆',
        text: `Your email has been successfully changed ! 🥳`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(' ✉️ [S]sendConfirmationEmailforChangedPassword: ✅ Email sent ');

    } catch (error) {
        console.log(' ✉️ [S]sendConfirmationEmailforChangedPassword: ❌ ERROR Email sent ');
        throw new Error('EMAIL_SERVICE_ERROR');
    }
};

export const confirmUserEmail = async (token: string): Promise<IUser> => {
    try {
        // Verifie si l'id du Jwt de l'Url est connue de la bdd. 
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

        console.log(' ✉️ [S]confirmEmail ] ✅ ');
        return await confirmUserEmailStatusbyUserId(user._id);

    } catch (error) {
        console.log(' ✉️ [S]confirmEmail ] ❌ Error: ', error);
        throw error;
    }
};


export const verifyTokenToGetEmail = async (token: string): Promise<IUser> => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            throw new Error('INVALID_USER_ID');
        }
        const userId = new mongoose.Types.ObjectId(decoded.id);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return user;
    } catch (error) {
        console.log(' ✉️ [S]verifyTokenToGetEmail ] ❌ Error: ', error);
        throw error;
    }
}


// - - - - - - - - - [ Fcts - USER -  Management ] - - - - - - - - -

const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const verifyUpdateNewPassword = async (email: string, newPassword: string, token: string): Promise<IUser> => {
    try {
        console.log(` [ verifyUpdateNewPassword ] email: ${email}, newPassword: ${newPassword}, token: ${token} `);
        // 1 - Verifie token et si User exist !
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            throw new Error('INVALID_USER_ID');
        }
        const userId = new mongoose.Types.ObjectId(decoded.id);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        // 2 - verif si Email correspondent 
        if (user.email.toLowerCase() !== email.toLowerCase()) {
            console.log(`INVALID_EMAIL: ${user.email} [vs] ${email}`);
            throw new Error('INVALID_EMAIL');
        }
        console.log(`EMAIL ✅ : ${user.email} [vs] ${email}`);

        // 3 - hash newPassword et update Bdd
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(userId, { passwordHash: hashedPassword }, { new: true });
        // console.log('  ✅ updatedUser: ', updatedUser);
        console.log(' [ verifyUpdateNewPassword ] ✅ ');

        // 4 - Send Confirmation Email that the password Changed
        await sendConfirmationEmailforChangedPassword(user.email);
        return updatedUser;

    } catch (error) {
        console.log(' ✉️ [S]verifyTokenToGetEmail ] ❌ Error: ', error);
        throw error;
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

        console.log(` 🥝 [S]*createU ] User: ${body.username}, ${body.email}:  [ Doesn't already exist! ]`);

        // - -[ * Password * Verification ]- -
        const pass: string = body.password;
        if (!validatePassword(pass)) {
            throw new Error('INVALID_PASSWORD');
        }
        console.log(` 🥝 [S]*createU ] body.password: ${pass}`);

        // - -[ * Hash * Password ]- -
        const hashedPassword: string = await bcrypt.hash(pass, 10);

        // - -[ * User * Creation ]- -
        const newUser = await createNewUser(body.username, body.email, hashedPassword);
        console.log(" 🥝 [S]*createU ] ✅ User created successfully: ", newUser);

        return newUser;

    } catch (error: any) {
        console.log("❌ Error User Creation: ", error.message);
        throw error;
    }
};

// export const createUser = async (body: any): Promise<IUser> => {
//     try {
//         // - -[ * User * Verifications ]- -
//         const existingUserByEmail = await findUserByEmail(body.email);
//         const existingUserByUsername = await findUserByUsername(body.username);
//         if (existingUserByEmail) {
//             throw new Error('EMAIL_ALREADY_EXISTS');
//         }
//         if (existingUserByUsername) {
//             throw new Error('USERNAME_ALREADY_EXISTS');
//         }
//         console.log(` 🥝 [S]*createU ] User: ${body.username}, ${body.email}:  [ Doesnt already exist ! ]`)

//         // - -[ * Hash * Password ]- -
//         const pass: string = body.password;
//         console.log(` 🥝 [S]*createU ] body.password: ${pass}`);
//         const hashedPassword: string = await bcrypt.hash(pass, 10);

//         // - -[ * User * Creation ]- -
//         const newUser = await createNewUser(body.username, body.email, hashedPassword);
//         console.log(" 🥝 [S]*createU ] ✅ User created successfully: ", newUser);

//         return newUser;

//     } catch (error) {
//         // console.error("❌ Error User Creation: ", error.message);
//         console.log("❌ Error User Creation: ", error.message);
//         throw error;
//     }
// };


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


export const sendResetPasswordEmail = async (userEmail: string): Promise<IUser> => {
    try {
        const user = await findUserByEmail(userEmail);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const front_url = process.env.FRONT_URL;
        const link: string = `${front_url}/resetPassword/${token}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: 'Reset Your Password for Camagru 42 🪆',
            text: `Please reset your password by clicking on the following link: ${link}`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(' ✉️ [S]forgottenPassword: ✅ Email sent successfully');
        } catch (error) {
            console.log(' ✉️ [S]forgottenPassword: ❌ ERROR Email sent ');
            throw new Error('EMAIL_SERVICE_ERROR');
        }

        return user;

    } catch (error) {
        throw error;
    }
}

