import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    body: String,
    imageId: String,
    comments: [{ username: String, body: String, date: Date }],
    date: { type: Date },
    likes: { type: Number }
})

const Post = mongoose.model('Post', postSchema)

export default Post