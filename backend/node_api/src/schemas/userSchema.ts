import mongoose, { Schema, Document } from 'mongoose'

// Ajout d' Interface pour clarete et typage de typescript
interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
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
    password: { 
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
