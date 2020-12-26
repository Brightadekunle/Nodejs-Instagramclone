const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('dotenv').config() // To use enviroment variables
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('cookie-session')
const flash = require('connect-flash')
const passport = require('passport')
const fileUpload = require('express-fileupload')
const initializePassport = require('./config/passport')
const path = require('path')


const app = express()

initializePassport(passport)

const dbURI = process.env.DATABASE
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log("MongoDB connected..."))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressLayouts)
app.set("view engine", "ejs")
app.use('/public', express.static(__dirname + "/public"))
app.use(morgan('dev'))


app.use(session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))

// git remote add origin https://github.com/Brightadekunle/Nodejs-Instagramclone.git
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// File upload middleware
app.use(fileUpload())


app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated()
    res.locals.error = req.flash('error')
    res.locals.logginUser = req.user
    next()
})



const authRoutes = require('./routes/auth')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/index')

app.use('/', authRoutes)
app.use('/', indexRoutes)
app.use('/', userRoutes)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}...`)
})