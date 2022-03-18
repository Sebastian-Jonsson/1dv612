const fetch = require('node-fetch')
const UserSettings = require('../models/userSettings')


async function sendHook(res, data) {
        await UserSettings.find()
        .select('-__v')
        .then(hooks => {
            for(const hook of hooks) {
                if(hook.hookUrl.length > 1) {
                    fetch(hook.hookUrl, {
                        method: 'POST',
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify(data)
                    })
                    res.status(200).json({})
                }
                else {
                    res.status(404)
                }
            }
        })
}


module.exports = { sendHook }