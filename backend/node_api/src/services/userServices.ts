import bcrypt from 'bcryptjs';
import { deleteUserByUserId, findUserById, IUser, updateUserById } from '../models/userSchema'
import { createNewUser, findUserByEmail, findUserByUsername } from '../models/userSchema';
import mongoose from 'mongoose';



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
        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(userId_string)) {
            throw new Error('INVALID_USER_ID');
        }

        const userId = new mongoose.Types.ObjectId(userId_string);
        const user: IUser = await findUserById(userId);

        return user;

    } catch (error) {
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

// export const confirmUserEmail = async (userId_string: string): Promise<IUser> => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(userId_string)) {
//             throw new Error('INVALID_USER_ID');
//         }

//         const userId = new mongoose.Types.ObjectId(userId_string);
//         const confirmedUser = await confirmUserEmailStatusbyUserId(userId);

//         return confirmedUser;

//     } catch (error) {
//         throw error;
//     }
// };
