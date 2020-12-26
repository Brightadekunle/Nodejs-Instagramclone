const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
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


module.exports = mongoose.model('User', userSchema)