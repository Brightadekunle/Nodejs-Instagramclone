const express = require('express')
const router = express.Router()

const indexController = require('../controllers/index')


router.route('/home')
    .get(indexController.getHomePage)


module.exports = router