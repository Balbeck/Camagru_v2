import { User, IUser } from '../schemas/userSchema'
import bcrypt from 'bcryptjs';

export const createUser = async (body: any): Promise<IUser> => {
    try {
        const existingUser = await User.findOne({
            $or: [{ email: body.email }, { username: body.username }]
        });
        if (existingUser) {
            if (existingUser.email === body.email) {
                throw new Error('EMAIL_ALREADY_EXISTS');
            } else {
                throw new Error('USERNAME_ALREADY_EXISTS')
            }
        }
        console.log(` 🥝 [S]*createU ] User: ${body} Doesnt already exist`)

        const pass: string = body.password;
        console.log(` 🥝 [S]*createU ] body.password: ${pass}`)
        const hashedPasword: string = await bcrypt.hash(pass, 10);
        // const hashedPasword = await bcrypt.hash(userData.password, 10);

        // Creer le new object (Schema) User
        const newUser = new User({
            ...body,
            password: hashedPasword,
        });
        console.log(` 🥝 [S]*createU ] newUser to Create: ${newUser}`);

        const savedUser = await newUser.save();
        console.log(" 🥝 [S]*createU ] ✅ User cree avec succes :", savedUser);
        return savedUser;

    } catch (err: any) {
        console.error("❌ Error User Creation :", err.message);
        throw err;
    }

};

export const logInUser = async (body: any): Promise<IUser> => {
    console.log(` 🚀 [S]*logInU ] body: ${body}`);
    const foundUser = await User.findOne({ email: body.email });
    if (!foundUser) {
        throw new Error('USER_NOT_FOUND');
    }
    console.log(` 🚀 [S]*logInU ] UserFound: ${body.email}`);

    const hashComparison = await bcrypt.compare(body.password, foundUser.password);
    if (!hashComparison) {
        console.log(` 🚀 [S]*logInU ] Hash Comparison ❌ `);
        throw new Error('INVALID_PASSWORD');
    }
    console.log(` 🚀 [S]*logInU ] Hash Comparison ✅ `);

    return foundUser;
};

