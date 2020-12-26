const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')


router.route('/signup')
    .get(authController.userSignupGet) 
    .post(authController.userSignupPost)

router.route('/signin')
    .get(authController.userSigninGet) 
    .post(authController.userSigninPost)

router.route('/forgot-password')
    .get(authController.getForgortPassword)
    .post(authController.postForgotPassword)

router.route('/reset-password/:token')
    .get(authController.getResetPassword)
    .post(authController.postResetPassword)

router.route('/logout')
    .get(isLoggedIn, authController.userLogout)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next()    
    }
    req.flash('error_message', 'Please log in to view this resource')
    res.redirect('/signin')
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()){
        return next()    
    }
    req.flash('error_message', 'Please log in to view this resource')
    res.redirect('/')
}

module.exports = router