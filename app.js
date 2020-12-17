const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('dotenv').config() // To use enviroment variables
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('cookie-session')
const flash = require('connect-flash')
const passport = require('passport')
const initializePassport = require('./config/passport')



const app = express()

initializePassport(passport)

const dbURI = process.env.DATABASE
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log("MongoDB connected..."))
    .catch(err => console.log(err))

app.use(expressLayouts)
app.set("view engine", "ejs")

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
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

app.use((req, res, next) => {
    res.locals.error = req.flash('error')
    next()
})



const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const indexRoutes = require('./routes/index')

app.use('/', authRoutes)
app.use('/', indexRoutes)
app.use('/user', userRoutes)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}...`)
})