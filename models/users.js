const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Notification = require('./notification')


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: 'public'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    memberSince: {
        type: Date,
        default: Date.now()
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
    },
    resetLink: {
        type: String,
        default: ''
    },
    followers: [{
        type: String,
    }],
    followed: [{
        type: String,
    }],
    posts: [{
        type: String,
    }],
    likedPost: [{
        type: String,
    }],
    notifications: [{
        type: String,
    }],
    lastNotificationReadTime: {
        type: Date
    }
}, { timestamps: true })

userSchema.methods.isFollowing = function (followed, callback) {
    const user = this

    for (var id of user.followed){
        if (followed.id == id){
            return true
        }
    }
    return false
}

userSchema.methods.hasLiked = function (post, callback) {
    const user = this

    for (var id of user.likedPost){
        if (post.id == id){
            return true
        }
    }
    return false
}

userSchema.methods.newNotification = async (callback) => {
    const user = this
    const lastReadTime = user.lastNotificationReadTime
    let newNotifications = []
    let notifications = await Notification.find({ user: user._id })
    notifications.forEach(notification => {
        if (notification.createdAt > lastReadTime){
            newNotifications.push(notification)
        }
    })
    if (newNotifications.length == 0){
        return null
    } else {
        return newNotifications.length()
    }
}

module.exports = mongoose.model('User', userSchema)