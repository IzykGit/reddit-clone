import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    title: {type: String, required: true},
    body: String,
    imageId: String,
    comments: [{ username: String, body: String, date: Date }],
    date: { type: Date }
})

const Post = mongoose.model('Post', postSchema)

export default Post