import mongoose, { Schema, Document, mongo } from "mongoose";

interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    imageUrl: string;
    title?: string;
    createdAt: Date;
    updatedAt: Date;
    likes: mongoose.Types.ObjectId[];
}

const postSchema: Schema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Definition et exportation du Model et de l'Interface
const Post = mongoose.model<IPost>('Post', postSchema);
export { Post, IPost };



// - - -[ *  POST  *  -  Related Fcts with DB ]- - -
export const createNewPost = async (userId: mongoose.Types.ObjectId, imageUrl: string, title?: string): Promise<IPost> => {
    const newPost: IPost = new Post({
        userId,
        imageUrl,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: []
    });
    return await newPost.save();
};

export const getPostByPostId = async (postId: mongoose.Types.ObjectId): Promise<IPost | null> => {
    return await
        Post.findById(postId).exec();
};

export const getLastNPosts = async (n: number): Promise<IPost[]> => {
    const limit: number = n;
    return await
        Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
};

export const getUserPosts = async (userId: mongoose.Types.ObjectId): Promise<IPost[]> => {
    return await
        Post.find({ userId })
            .sort({ createdAt: -1 })
            .exec();

};

export const updatePostByPostId = async (postId: mongoose.Types.ObjectId, updates: Partial<IPost>): Promise<IPost | null> => {
    updates.updatedAt = new Date();
    return await
        Post.findByIdAndUpdate(postId, updates, { new: true }).exec();
};

export const deletePost = async (postId: mongoose.Types.ObjectId) => {
    return await Post.findByIdAndDelete(postId).exec();
};


// - - -[ *  LIKES  *  -  Related Fcts with DB ]- - -
export const addLike = async (postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
    return await
        Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
            .exec();
};

export const removeLike = async (postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
    return await
        Post.findOneAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
            .exec();
};

export const getLikeCount = async (postId: mongoose.Types.ObjectId): Promise<number> => {
    const post = await Post.findById(postId, 'likes').exec();
    return post ? post.likes.length : 0;
};
