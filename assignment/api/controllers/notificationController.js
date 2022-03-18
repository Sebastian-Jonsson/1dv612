const UserSettings = require('../models/userSettings')
const fetch = require('node-fetch');
const { sendHook } = require('../middlewares/sendHook');
const { userDecider } = require('../middlewares/utility/userDecider');
const { messageFormatter } = require('../middlewares/utility/messageFormatter');
const { socketList } = require('../middlewares/utility/socketHandler');

require('dotenv').config();

const HOOK_URL = process.env.HOOK_URL

const notificationController = {}

notificationController.getGroups = async (req, res, next) => {
    try {
        const groups = await fetch(`https://gitlab.lnu.se/api/v4/groups?min_access_level=50&access_token=${req.session.user.token}`)
        const groupData = await groups.json()
    
        let groupInfo = []
        
        groupData.map(async g => { 
            await groupInfo.push({
                id: g.id,
                groupName: g.name
            })
            let combinedUrls = ''
            
            const groupHooks = await fetch(`https://gitlab.lnu.se/api/v4/groups/${g.id}/hooks?min_access_level=50&access_token=${req.session.user.token}`)
            const hooksInfo = await groupHooks.json()

            hooksInfo.map(h => {
                combinedUrls += h.url
            })
            
            if (!combinedUrls.includes(HOOK_URL)) {
                const params = new URLSearchParams()
    
                params.append('url', HOOK_URL)
                params.append('push_events', 'true')
                params.append('issues_events', 'true')
                params.append('confidential_issues_events', 'true')
                params.append('releases_events', 'true')
                
                groupInfo.map(async g => {
                    await fetch(`https://gitlab.lnu.se/api/v4/groups/${g.id}/hooks?min_access_level=50&access_token=${req.session.user.token}`, {
                    method: 'POST',
                    body: params
                    })
    
                })
            }
        })
        res.status(200).json({ groupInfo })
        
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

notificationController.groupSelection = async (req, res, next) => {
    const groupCheck = await fetch(`https://gitlab.lnu.se/api/v4/groups/${req.body.groupId}?min_access_level=50&access_token=${req.session.user.token}`)
    const groupChoice = await groupCheck.json()
    
    try {
    let groupSelectId = groupChoice.projects[0].id
    let username = req.session.user.username

    req.session.user.groupSetting = groupSelectId

        await UserSettings.find({ username: username })
        .then(
            UserSettings.updateOne({ username: username }, { groupSetting: groupSelectId })
            .then(
                res.status(200).json(req.body.groupName) 
            )
        )   
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized.'})
    }
}

notificationController.addDiscordUrl = async (req, res, next) => {
    try {
    let username = req.session.user.username

        await UserSettings.find({ username: username })
        .then(
            UserSettings.updateOne({ username: username }, { hookUrl: req.body.hookUrl })
            .then(
                res.status(200).json() 
            )
        )   
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized.' })
    }
}

// https://docs.mongodb.com/manual/reference/operator/update/pullAll/
// Todo: Available possibility of security check: io.on('connection', function(socket) { console.log('Socket-ID available before emit: ' + socket.id)})
notificationController.emitInformation = async (req, res, next) => {
    try {
    const io = req.app.get('socketio')

    let user = await userDecider(req.body)

    UserSettings.findOne({ username: user })
    .then(await sendHook(res, {content: messageFormatter(req.body, 'discord')}),
    res.status(200))

    if(!Object.values(socketList).includes(user)) {
        savedMessage = {data: messageFormatter(req.body, 'client')}
        
        UserSettings.updateOne({ username: user }, 
            { $push: { notifications: savedMessage } }
            )
            .then( res.status(200) )
        }
            else {
            UserSettings.updateOne({ username: user }, {$set: {notifications: []}})
            .then( res.status(200) )
            
            UserSettings.find({ groupSetting: req.body.project.id })
            .then(group => {
                if (group.length >= 1) {
                    let emitData = {data: messageFormatter(req.body, 'client')}
                    
                    const socketIds = Object.keys(socketList) 
                    const selectId = socketIds.find(socketId => socketList[socketId] === user)
                    console.log(selectId)
                    io.to(selectId).emit('notification', emitData)
        
                    res.status(200)
                }
                else {
                    res.status(404).json({ message: 'Not found' })
                }
            })
        }
    } catch (error) {
        res.status(400).json({ message: error })
    }
}

notificationController.getMissedNotifications = async (req, res, next) => {
    let missedMessages = await UserSettings.findOne({ username: req.session.user.username })

    res.status(200).json(missedMessages.notifications)
}

module.exports = notificationController 