const mongoose = require('mongoose')
const UserSettings = require('../models/userSettings')
const fetch = require('node-fetch');


require("dotenv").config();

const redir = process.env.REDIRECT_LINK

// https://docs.gitlab.com/ee/api/oauth2.html
const userController = {}

// OAuth first check.
userController.logIn = async (req, res, next) => {
    res.redirect(`https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${process.env.CODE_STATE}&scope=api read_user read_api read_repository write_repository read_registry write_registry sudo openid profile`)
}

// OAuth callback.
userController.callback = async (req, res, next) => {
    const codePiece = req.query.code
    
    const data = await fetch(`https://gitlab.lnu.se/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.SECRET}&code=${codePiece}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`,
    {
        method: "POST",
    })
    
    const token = await data.json()
    
    const user = await fetch(`https://gitlab.lnu.se/api/v4/user?access_token=${token.access_token}`)
    const { username, id, name } = await user.json()
    
    // Setting session and checking if a user exists
    req.session.user = {
        id: id,
        username: username,
        name: name,
        token: token.access_token,
        groupSetting: ''
    }

    await UserSettings.findOne({ username: username })
    .select('-__V')
    .then(user => {
        if (!user) {
            const userSettings = new UserSettings({
                _id: new mongoose.Types.ObjectId(),
                userId: id,
                username: username,
                name: name,
                token: token.access_token,
                groupSetting: '',
                hookUrl: '',
                notifications: []
            })
            userSettings.save()
            
            res.redirect(`${redir}/dashboard`)        
        }
        else {
            UserSettings.updateOne({ username: username }, { token: token.access_token })
            .then(
                res.redirect(`${redir}/dashboard`)
            )
        }
    })
}

// Checks and provides logged in status
userController.isLoggedIn = async (req, res, next) => {
    try {
        if (req.session.user !== undefined) {
            return res.status(200).json({ isLoggedIn: true, userSocket: req.session.user.username })
        } 

        res.status(401).json({ isLoggedIn: false })

    } catch (error) {
        res.status(400)
        
    }
}


module.exports = userController 