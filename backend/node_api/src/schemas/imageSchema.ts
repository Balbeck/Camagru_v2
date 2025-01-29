import mongoose, { Schema } from "mongoose";

const imageSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'One of my latest picture !'
    },
    createdAt: {
        type: Date,
        defautl: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports.Image = mongoose.model('Image', imageSchema);
