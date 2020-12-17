
const express = require('express')
const router = express.Router()

const userControllers = require('../controllers/user')

router.route('/profile')
    .get(userControllers.getProfilePage)



module.export = router