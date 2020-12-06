const mongoose = require('mongoose')
const Schema = mogoose.Schema


const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    lastName: {
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
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)