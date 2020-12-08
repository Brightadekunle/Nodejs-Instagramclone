const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')


router.route('/signup')
    .get(authController.userSignupGet) 
    .post(authController.userSignupPost)

router.route('/signin')
    .get(authController.userSigninGet) 
    .post(authController.userSigninPost)






module.exports = router