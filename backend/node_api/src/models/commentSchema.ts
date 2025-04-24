import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema: Schema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        auto: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export { Comment, IComment };



export const createNewComment = async (
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    comment: string
): Promise<IComment> => {

    const newComment: IComment = new Comment({
        userId: userId,
        postId: postId,
        comment: comment,
        createdAt: new Date(),
        updateddAt: new Date()
    });

    return await newComment.save();
};


export const deleteCommentByCommentId = async (commentId: mongoose.Types.ObjectId): Promise<IComment | null> => {
    return await Comment.findByIdAndDelete(commentId).exec();
};


export const findAllCommentsByPostId = async (postId: mongoose.Types.ObjectId): Promise<IComment[] | null> => {
    return await
        Comment.find({ postId })
            .sort({ createdAt: -1 })
            // .populate('userId', 'username') // Récupère uniquement le champ `username` de l'utilisateur
            .exec();
};


export const findLastCommentByPostId = async (postId: mongoose.Types.ObjectId): Promise<IComment | null> => {
    return await Comment.findOne({ postId })
        .sort({ createdAt: -1 })
        .exec();
};


// export const updateCommentByCommentId = async (
//     commentId: mongoose.Types.ObjectId,
//     updates: Partial<IComment>
// ): Promise<IComment | null> => {
//     updates.updatedAt = new Date();
//     return await Comment.findByIdAndUpdate(commentId, updates, { new: true }).exec();
// };


// export const findCommentByCommentId = async (commentId: mongoose.Types.ObjectId): Promise<IComment | null> => {
//     return await Comment.findById(commentId).exec();
// };



// const comments = await Comment.find({ postId: somePostId })
//     .populate('userId', 'username') // Récupère uniquement le champ `username` de l'utilisateur
//     .populate('postId', 'title')   // Récupère uniquement le champ `title` du post
//     .exec();