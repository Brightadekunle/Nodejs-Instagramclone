const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')

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


module.exports = {
    userSignupGet,
    userSignupPost,
    userSigninGet,
    userSigninPost,
}