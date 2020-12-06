const express = require('express')
require('dotenv').config() // To use enviroment variables
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')



const app = express()

const dbURI = process.env.DATABASE
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log("MongoDB connected..."))
    .catch(err => console.log(err))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}...`)
})