const mongoose = require('mongoose');
const Schema = mongoose.Schema



const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    replies : [{
        type: Object,
    }]
})

module.exports = mongoose.model("Comment", commentSchema);