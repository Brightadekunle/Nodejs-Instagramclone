const express = require('express')
const router = express.Router()

const userControllers = require('../controllers/user')
const { isAuthenticated } = require('../config/customFunctions')

router.route('/:username')
    .get(isLoggedIn, userControllers.getProfilePage)

router.route('/update/:username')
    .get(isLoggedIn, userControllers.updateProfileGet)
    .post(isLoggedIn, userControllers.updateProfilePost)

router.route('/follow/:username')
    .get(isLoggedIn, userControllers.followUser)

router.route('/unfollow/:username')
    .get(isLoggedIn, userControllers.unfollowUser)

router.route('/upload')
    .post(userControllers.postUpload)

router.route('/like/:postId')
    .get(userControllers.likePost)

router.route('/unlike/:postId')
    .get(userControllers.unlikePost)

router.route('/comment/:postId')
    .post(userControllers.commentPost)

router.route('/reply/:commentId')
    .post(userControllers.replyComment)

router.route('/notifications')
    .get(userControllers.getNotification)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next()    
    }
    req.flash('error_message', 'Please log in to view this resource')
    res.redirect('/signin')
}



module.exports = router