import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    image: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    updateddAt: Date;
}

const commentSchema: Schema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        auto: true
    },
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

// Creation Modele pour export
const Comment = mongoose.model<IComment>('Comment', commentSchema);
export { Comment, IComment };

// module.exports.Comment = mongoose.model('Comment', commentSchema);
