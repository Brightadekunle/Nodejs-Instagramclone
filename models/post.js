const mongoose = require('mongoose');
const Schema = mongoose.Schema



const postSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    file: {
        type: String,
        default: ''
    }
}, { timestamps: true })



module.exports = mongoose.model("Post", postSchema);