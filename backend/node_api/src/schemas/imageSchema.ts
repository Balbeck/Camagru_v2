import mongoose, { Schema, Document } from "mongoose";

interface IImage extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    imageUrl: string;
    title?: string;
    createdAt: Date;
    updatedAt: Date;
}

const imageSchema: Schema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
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

// Definition et exportation du Model et de l'Interface
const Image = mongoose.model<IImage>('Image', imageSchema);
export { Image, IImage };

// module.exports.Image = mongoose.model('Image', imageSchema);
