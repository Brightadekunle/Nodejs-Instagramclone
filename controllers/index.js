
const Post = require('../models/post')
const User = require('../models/users')
const Notification = require('../models/notification')

const getHomePage = async (req, res, next) => {
    let notifications = await Notification.find({ user: req.user._id })
    const newNotifications = []
    if (req.user){
        let user = req.user
        User.findOne({ username: user.username })
            .then(user => {
                const lastReadTime = user.lastNotificationReadTime
                notifications.forEach(notification => {
                if (notification.createdAt > lastReadTime){
                    newNotifications.push(notification)
                    }
                    })
                // console.log(newNotifications)
                const notificationLength = newNotifications.length 
                req.session.notificationLength = notificationLength;
                Post.find()
                    .populate('user')
                    .populate({path: 'comments', populate: { path: 'user', model: 'User' }})
                    .then(posts => {
                        res.render('index.ejs', { title: "Instagram Clone", user: req.user, posts})
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }
}



module.exports = {
    getHomePage,
}