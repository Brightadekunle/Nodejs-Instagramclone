const express = require('express')
const { getForgortPassword } = require('../controllers/auth')
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



module.exports = router