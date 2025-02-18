import bcrypt from 'bcryptjs';
import { findUserById, IUser } from '../models/userSchema'
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

// export const getUserById = async (userId) => {
//     return await findUserById(userId);
// };



// export const createUser = async (body: any): Promise<IUser> => {
//     try {
//         const existingUser = await User.findOne({
//             $or: [{ email: body.email }, { username: body.username }]
//         });
//         if (existingUser) {
//             if (existingUser.email === body.email) {
//                 throw new Error('EMAIL_ALREADY_EXISTS');
//             } else {
//                 throw new Error('USERNAME_ALREADY_EXISTS')
//             }
//         }
//         console.log(` 🥝 [S]*createU ] User: ${body} Doesnt already exist`)

//         const pass: string = body.password;
//         console.log(` 🥝 [S]*createU ] body.password: ${pass}`)
//         const hashedPasword: string = await bcrypt.hash(pass, 10);
//         // const hashedPasword = await bcrypt.hash(userData.password, 10);

//         // Creer le new object (Schema) User
//         const newUser = new User({
//             ...body,
//             password: hashedPasword,
//         });
//         console.log(` 🥝 [S]*createU ] newUser to Create: ${newUser}`);

//         const savedUser = await newUser.save();
//         console.log(" 🥝 [S]*createU ] ✅ User cree avec succes :", savedUser);
//         return savedUser;

//     } catch (err: any) {
//         console.error("❌ Error User Creation :", err.message);
//         throw err;
//     }

// };

// export const logInUser = async (body: any): Promise<IUser> => {
//     console.log(` 🚀 [S]*logInU ] body: ${body}`);
//     const foundUser = await User.findOne({ email: body.email });
//     if (!foundUser) {
//         throw new Error('USER_NOT_FOUND');
//     }
//     console.log(` 🚀 [S]*logInU ] UserFound: ${body.email}`);

//     const hashComparison = await bcrypt.compare(body.password, foundUser.passwordHash);
//     if (!hashComparison) {
//         console.log(` 🚀 [S]*logInU ] Hash Comparison ❌ `);
//         throw new Error('INVALID_PASSWORD');
//     }
//     console.log(` 🚀 [S]*logInU ] Hash Comparison ✅ `);

//     return foundUser;
// };

// export const getUser_by_id = async (id: string): Promise<IUser> => {
//     return (await User.findById(id).select("username bio profilePicture"));
// };
