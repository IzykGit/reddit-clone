import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    title: {type: String, required: true},
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', postSchema)

export default Post