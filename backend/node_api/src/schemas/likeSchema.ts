import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports.Like = mongoose.model('Like', likeSchema);
