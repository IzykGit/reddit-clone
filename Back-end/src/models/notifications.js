import mongoose from 'mongoose';

const { Schema } = mongoose;


const notifiers = new Schema({
    userNames: [String],
    postBody: String,
    postId: String,
    default: []
})


const notificationsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    notifications: notifiers
})

const Notifications = mongoose.model('Post', notificationsSchema)

export default Notifications