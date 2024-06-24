import mongoose from 'mongoose';

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
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date
    },
    notifications: [{
        title: String,
        date: Date,
        default: []
    }]
})

const UserProfile = mongoose.model('Post', userSchema)

export default UserProfile