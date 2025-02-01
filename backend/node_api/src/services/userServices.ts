import { User, IUser } from '../schemas/userSchema'
import bcrypt from 'bcrypt';

export const createUser = async (body: any): Promise<IUser> => {
    try {
        // Verif si le User existe deja
        const existingUser = await User.findOne({ $or: [{ email: body.email }, { username: body.username }] });
        if (existingUser) {
            if (existingUser.email === body.email) {
                throw new Error('EMAIL_ALREADY_EXISTS');
            } else {
                throw new Error('USERNAME_ALREADY_EXISTS')
            }
        }
        console.log(` 🥝 User: ${body} Doesnt already exist`)
        // Hash le password
        const pass: string = body.password;
        console.log(` 🚀 userData.password: ${body.password}`)
        const hashedPasword = await bcrypt.hash(pass, 10);
        // const hashedPasword = await bcrypt.hash(userData.password, 10);
        // Creer le new object (Schema) User
        const newUser = new User({
            ...body,
            password: hashedPasword,
        });
        console.log(` 🦧 newUser to Create: ${newUser}`);
        const savedUser = await newUser.save();
        console.log("✅ User cree avec succes :", savedUser);
        return savedUser;
    } catch (err: any) {
        console.error("❌ Error User Creation :", err.message);
        throw err;
    }
};

export const findUserByEmail = async (body: any): Promise<IUser> => {
        console.log(` 🚀 [ findUserByEmail Srvc ]: body: ${body}`);
        const foundUser = await User.findOne({ email: body.email });
        if (!foundUser) {
            throw new Error('USER_NOT_FOUND');
        }
        console.log(` 🚀 [ findUserByEmail Srvc ]: UserFound: ${body.email}`);
        const hashComparison = await bcrypt.compare(body.password, foundUser.password);
        if (!hashComparison) {
            console.log(` 🚀 [ findUserByEmail Srvc ]: Hash Comparison ❌ `);
            throw new Error('INVALID_PASSWORD');
        }
        console.log(` 🚀 [ findUserByEmail Srvc ]: Hash Comparison ✅ `);

        return foundUser;
};

