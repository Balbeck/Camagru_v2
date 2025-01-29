import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
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
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports.Comment = mongoose.model('Comment', commentSchema);
