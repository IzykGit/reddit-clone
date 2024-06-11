import mongoose from 'mongoose';
import { type } from 'os';

const { Schema } = mongoose;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    }
})

const UserProfile = mongoose.model('Post', userSchema)

export default UserProfile