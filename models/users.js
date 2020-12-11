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
        type: Date
    },
    profilePicture: {
        type: String,
    },
    resetLink: {
        type: String,
        default: ''
    }
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)