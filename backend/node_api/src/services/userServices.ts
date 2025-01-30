import { User, IUser } from '../schemas/userSchema'
import bcrypt from 'bcrypt';

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
    // Verif si le User existe deja
    const existingUser = await User.findOne({ $or: [{ email: String }, { username: String }] });
    if (existingUser) {
        if (existingUser.email === userData.email) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        } else {
            throw new Error('USERNAME_ALREADY_EXISTS')
        }
    }
    console.log(` 🥝 User: ${userData} Doesnt already exist`)
    // Hash le password
    const pass: string = userData.password;
    console.log(` 🚀 userData.password: ${userData.password}`)
    const hashedPasword = await bcrypt.hash(pass, 10);
    // Creer le new object (Schema) User
    const newUser = new User({
        ...userData,
        password: hashedPasword,
    });
    console.log(` 🦧 newUser to Create: ${newUser}`);
    return await newUser.save()
};
