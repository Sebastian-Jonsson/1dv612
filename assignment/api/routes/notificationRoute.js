const router = require('express').Router()

const controller = require('../controllers/notificationController')

router.get('/getGroups', controller.getGroups)
router.put('/groupSelection', controller.groupSelection)
router.get('/getMissedNotifications', controller.getMissedNotifications)

router.put('/addDiscordUrl', controller.addDiscordUrl)
router.post('/emitInformation', controller.emitInformation)


module.exports = router