const passport = require('passport')
const bcrypt = require('bcrypt-nodejs')
const mailgun = require('mailgun-js')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const DOMAIN = 'sandboxd8329dceb8654f20970d26c9a80cba3c.mailgun.org'
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

const User = require('../models/users')

const userSignupGet = (req, res, next) => {
    res.render('auth/register', { title: "Register", success_msg: '' })
}

const userSignupPost = (req, res, next) => {
    const { name, email, username, password, password2 } = req.body
    const errors = []
    console.log(errors)
    if (!email || !name || !username || !password || !password2){
        errors.push({ msg: "Missing credentials" })
    }
    if (password !== password2){
        // error for passwords do not match
        errors.push({ msg: "Passwords do not match" })
    }
    if (password.length < 6){
        errors.push({ msg: "Password should be at least 6 characters!." })
    }
    if (errors.length > 0){
        console.log(errors)
        res.render("auth/register", {
            errors: errors,
            name: name,
            username: username, 
            email: email,
            title: "Register"

        })
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user){
                    errors.push({ msg: "Email is already registered" })
                    res.render("auth/register", {
                        errors: errors,
                        name: name,
                        username: username, 
                        email: email,
                        title: "Register"
                    }) 
                } else {
                    const hash = bcrypt.hashSync(password, bcrypt.genSalt(10, (err) => {
                        if (err){
                            console.log(err)
                            res.send(err)
                        }
                    }))
                    const newUser = new User({
                        email: email,
                        password: hash,
                        name: name,
                        username: username
                    })
                    newUser.save()
                        .then(savedUser => {
                            req.flash('success_message', "You are now registered, you can login!.")
                            res.redirect('/signin')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
    }

}

const userSigninGet = (req, res, next) => {
    const success_msg = req.flash('success_message')
    res.render('auth/login', { title: "Login", success_msg })
}

const userSigninPost = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true,
        session: true
    })(req, res, next)
}

const getForgortPassword = (req, res, next) => {
    const success_msg = req.flash('success_message')
    res.render('auth/reset_password_request', { title: "forgot-password", success_msg })
}

const postForgotPassword = (req, res, next) => {
    const email = req.body.email
    const errors = []

    User.findOne({ email: email })
        .then(user => {
            if (!user){
                errors.push({ msg: "Email does not exist" })
                res.render('auth/reset_password_request', { title: "forgot-password", errors })
            } 
            const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {  expiresIn: '20m'})
            const data = {
                from: 'noreply@hello.com',
                to: email,
                subject: 'Password reset link',
                html: `
                    <h2>Please click on the given link to reset your password</h2>
                    <a href="'${process.env.CLIENT_URL}/reset-password/${token}'">${process.env.CLIENT_URL}/reset-password/${token}</a>
                `
            }
            return user.updateOne({ resetLink: token }, (err, success) => {
                if (err){
                    req.flash('error_message', "Reset password link error.")
                    res.redirect('/forgot-password')
                } else {
                    mg.messages().send(data, function (error, body) {
                        if (error){
                            console.log(error)
                            res.send(error)
                        }
                        req.flash('success_message', "An email has been sent to you.")
                        res.redirect('/forgot-password')
                    });
                }

            })

        })
}

const getResetPassword = (req, res, next) => {
    const token = req.params.token
    const success_msg = req.flash('success_message')
    res.render('auth/reset_password', { title: "reset password", success_msg, token })
}

const postResetPassword = (req, res, next) => {
    const token = req.params.token
    const newPassword = req.body.password

    if ( token ){
        jwt.verify(token, process.env.RESET_PASSWORD_KEY, (err, decoded) => {
            if (err){
                req.flash('error_message', 'Incorrect or expired token.')
                res.redirect('/reset-password')
            } else{
                User.findOne({ resetLink: token })
                    .then(user => {
                        if (!user){
                            req.flash('error_message', 'User with this email does not exist.')
                            res.redirect(`/reset-password/${token}`)
                        } else{
                            const hash = bcrypt.hashSync(newPassword, bcrypt.genSalt(10, (err) => {
                                if (err){
                                    console.log(err)
                                }
                            }))
                            const obj = {
                                password: hash,
                                resetLink: ''
                            }
                            user = _.extend(user, obj)
                            user.save()
                                .then(savedUser => {
                                    console.log(savedUser)
                                    req.flash('success_message', 'Your password has been reset!.')
                                    res.redirect(`/signin`)
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.send(err)
                                })
                        }

                    })
            }
        })
    } else {
        req.flash('error_message', 'Authentication error!.')
        res.redirect('/reset-password')
    }

}


module.exports = {
    userSignupGet,
    userSignupPost,
    userSigninGet,
    userSigninPost,
    getForgortPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword,
}