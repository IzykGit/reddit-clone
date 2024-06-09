import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    body: String,
    comments: [{ username: String, body: String, date: Date, likes: Number }],
    imageId: String,
    date: { type: Date },
    likes: { type: Number, default: 0 }
})

const Post = mongoose.model('Post', postSchema)

export default Post