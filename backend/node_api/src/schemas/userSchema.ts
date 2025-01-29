const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true,
        require: true,
    },
    email: { 
        type: String, 
        unique: true,
        require: true,
    },
    password: { 
        type: String, 
        unique: false,
        require: true,
    },
});

module.exports.Users = mongoose.model('User', userSchema);
