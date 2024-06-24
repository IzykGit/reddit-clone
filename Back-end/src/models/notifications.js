import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    notifications: [{
        title: String,
        date: Date,
        default: []
    }]
})

const Notifications = mongoose.model('Post', notificationsSchema)

export default Notifications