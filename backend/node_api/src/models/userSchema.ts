import mongoose, { Schema, Document } from 'mongoose'

// Ajout d' Interface pour clarete et typage de typescript
interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    profilePicture: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
    emailConfirmed: Boolean;
}

const userSchema: Schema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'default_profile_picture.jpg',
    },
    bio: {
        type: String,
        default: 'Hello W 🌏rld ! Here I 📸m !'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    }
});

// Modele (Schema)
const User = mongoose.model<IUser>('User', userSchema);
export { User, IUser };

// module.exports.User = mongoose.model('User', userSchema);

export const createNewUser = async (username: string, email: string, passwordHash: string, profilePicture?: string, bio?: string): Promise<IUser> => {
    const newUser: IUser = new User({
        username,
        email,
        passwordHash,
        profilePicture: profilePicture || 'default_profile_picture.jpg',
        bio: bio || 'Hello W 🌏rld ! Here I 📸m !',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailConfirmed: false
    });

    return await newUser.save();
};

export const findUserById = async (userId: mongoose.Types.ObjectId): Promise<IUser | null> => {
    return await
        User.findById(userId).exec();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return await
        User.findOne({ email }).exec();
};

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
    return await
        User.findOne({ username }).exec();
};

export const updateUserById = async (userId: mongoose.Types.ObjectId, updates: Partial<IUser>): Promise<IUser | null> => {
    updates.updatedAt = new Date();
    return await
        User.findByIdAndUpdate(userId, updates, { new: true }).exec();
};

export const deleteUserByUserId = async (userId: mongoose.Types.ObjectId): Promise<IUser | null> => {
    return await
        User.findByIdAndDelete(userId).exec();
};

export const confirmUserEmailbyUserId = async (userId: mongoose.Types.ObjectId): Promise<IUser | null> => {
    return await
        User.findByIdAndUpdate(userId, { emailConfirmed: true }, { new: true }).exec();
};
