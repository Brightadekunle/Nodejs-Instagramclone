const { Strategy } = require('passport-local')
const bcrypt = require('bcrypt-nodejs')

const User = require('../models/users')

function isValidPassword(userpassword, password){
    return bcrypt.compareSync(password, userpassword)
}

const initialize = function(passport){
    passport.use(
        new Strategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user){
                        return done(null, false, { message: 'Email is not registered' })
                    }
                    if (!isValidPassword(user.password, password)){
                        return done(null, false, { message: 'Invalid Password' })
                    }
                    const userInfo = user
                    return done(null, userInfo)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
            if (user){
                return done(null, user)
            } else{
                return done(null, false)
            }
        })
            .catch((err) => {
                console.log('There was an error deserializing user')
                throw err
            })
    }) 
}

module.exports = initialize