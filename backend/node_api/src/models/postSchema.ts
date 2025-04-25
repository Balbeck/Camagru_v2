import mongoose, { Schema, Document } from "mongoose";
import { getLikeCountPerPost, Like } from "./likeSchema";
import { Comment } from "./commentSchema";
import { IUser } from "./userSchema";
import { IImage } from "./imageSchema";


interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    imageId: mongoose.Types.ObjectId;
    title: string;
    createdAt: Date;
    updatedAt: Date;
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
    },
    imageId: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    title: {
        type: String,
        default: 'One of my latest pictures !'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model<IPost>('Post', postSchema);
export { Post, IPost };




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




export interface IPostData {
    _id: string;
    userId: {
        _id: string,
        username: string
    };
    imageId: { data: string };
    title: string;
    createdAt: string;
    likes: {
        nbr_likes: number,
        didILikeIt: boolean
    };
    comments: {
        _id: string,
        userId: {
            _id: string,
            username: string
        },
        text: string,
        createdAt: string
    }[];
};

export const getUserPosts = async (userId: mongoose.Types.ObjectId): Promise<IPostData[]> => {
    try {
        // const posts = await Post.find({ userId })
        //     .sort({ createdAt: -1 })
        //     .populate('userId', 'username') // recupere _id + username 
        //     .populate('imageId', 'data') // Return _id + data pour ImageId
        //     .exec();
        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .populate<{ userId: IUser }>('userId', 'username')
            .populate<{ imageId: IImage }>('imageId', 'data')
            .exec();
        if (!posts || posts.length === 0) {
            return [];
        }

        // Formater chaque post
        const formattedPosts = await Promise.all(
            posts.map(async (post) => {
                const postId_str = post._id.toString();
                const postId = new mongoose.Types.ObjectId(postId_str);
                const comments = await Comment.find({ postId: postId })
                    .populate<{ userId: IUser }>('userId', 'username')
                    .select('_id userId comment createdAt')
                    .exec();


                const nbr_likes = await Like.countDocuments({ postId: postId }).exec();
                const didILikeIt = !!(await Like.exists({ postId: postId, userId: userId }).exec()); // double negation '!!' pour transformer en bool
                console.log(' 🌅 [M]*getUserPosts ] nbr_likes: ', nbr_likes, '  -  didILikeIt: ', didILikeIt);



                // Formater les commentaires
                const formattedComments = comments.map((comment) => (
                    {
                        _id: comment._id.toString(),
                        userId: {
                            _id: comment.userId._id.toString(),
                            username: comment.userId.username
                        },
                        text: comment.comment,
                        createdAt: comment.createdAt.toISOString()
                    }
                ));

                // Retourner le post formaté
                return (
                    {
                        _id: post._id.toString(),
                        userId: {
                            _id: post.userId._id.toString(),
                            username: post.userId.username
                        },
                        imageId: {
                            data: post.imageId.data
                        },
                        title: post.title,
                        createdAt: post.createdAt.toISOString(),
                        likes: {
                            nbr_likes,
                            didILikeIt: !!didILikeIt // bool
                        },
                        comments: formattedComments
                    }
                );
            })
        );

        return formattedPosts;
    } catch (error) {
        console.error(' 📸 [M]*getUserPosts ] ❌ Error: ', error)
        throw error;
    }
};





// export const updatePostByPostId = async (postId: mongoose.Types.ObjectId, updates: Partial<IPost>): Promise<IPost | null> => {
//     updates.updatedAt = new Date();
//     return await
//         Post.findByIdAndUpdate(postId, updates, { new: true }).exec();
// };

// export const deletePost = async (postId: mongoose.Types.ObjectId) => {
//     return await Post.findByIdAndDelete(postId).exec();
// };

export const getAllThePosts = async (): Promise<IPost[]> => {
    const posts = await Post.find()
        .sort({ createdAt: -1 }) // Tri par createdAt
        .populate('userId', 'username') // Return username avec userId
        .populate('imageId') // Return obj Image
        .exec();
    console.log(' 📸 [M]*getAllThePosts ] ***[ posts ]***\n', posts);
    return posts;
};
