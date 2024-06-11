import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    userId: String,
    body: String,
    comments: [{ postedBy: String, body: String, date: Date, likes: Number }],
    imageId: String,
    date: { type: Date },
    likes: { type: Number, default: 0 },
    likeIds: [{ likeIds: String }],
    userName: { type: String, required: true }
})

const Post = mongoose.model('Post', postSchema)

export default Post