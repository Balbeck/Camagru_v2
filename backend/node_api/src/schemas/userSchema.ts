const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
});

module.exports.User = mongoose.model('User', userSchema);
