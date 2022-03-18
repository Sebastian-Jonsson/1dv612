const router = require('express').Router()

const controller = require('../controllers/userController')

router.get('/logIn', controller.logIn)
router.get('/callback', controller.callback)
router.get('/isLoggedIn', controller.isLoggedIn)


module.exports = router