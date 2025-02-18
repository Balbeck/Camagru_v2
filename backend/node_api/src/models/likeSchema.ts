// import mongoose, { Schema, Document } from "mongoose";

// interface ILike extends Document {
//     _id: mongoose.Types.ObjectId;
//     userId: mongoose.Types.ObjectId;
//     postId: mongoose.Types.ObjectId;
//     createdAt: Date;
// }

// const likeSchema: Schema = new mongoose.Schema({
//     _id: {
//         type: mongoose.Types.ObjectId,
//         auto: true
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     postId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Image',
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// //Creation du Modele a exporter (Schema)
// const Like = mongoose.model<ILike>('Like', likeSchema);
// export { Like, ILike };

// // module.exports.Like = mongoose.model('Like', likeSchema);
