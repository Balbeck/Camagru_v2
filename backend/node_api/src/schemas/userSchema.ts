import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    description: String,
    complete: Boolean
});

module.exports.Users = mongoose.model('User', userSchema);
