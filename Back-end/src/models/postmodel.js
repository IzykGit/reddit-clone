import mongoose from 'mongoose';

const { Schema } = mongoose;

const { ObjectId } = mongoose.Schema.Types;


const commentSchema = new Schema({
    userName: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    commentLikeIds: [{ type: String, default: ["Placeholder"] }],
    id: { type: String, required: true },
    userId: { type: String, required: true }
});

const postSchema = new Schema({
    userId: String,
    body: String,
    comments: [commentSchema],
    imageId: String,
    date: { type: Date },
    likes: { type: Number, default: 0 },
    likedIds: [{ type: String }],
    userName: { type: String, required: true }
})

const Post = mongoose.model('Post', postSchema)

export default Post