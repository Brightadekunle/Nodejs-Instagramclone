
const Post = require('../models/post')

const getHomePage = (req, res, next) => {
    Post.find()
        .populate('user')
        .populate({path: 'comments', populate: { path: 'user', model: 'User' }})
        .then(posts => {
            res.render('index.ejs', { title: "Instagram Clone", user: req.user, posts})
        })
}



module.exports = {
    getHomePage,
}