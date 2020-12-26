const mongoose = require('mongoose');
const Schema = mongoose.Schema



const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isRead : {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema);
