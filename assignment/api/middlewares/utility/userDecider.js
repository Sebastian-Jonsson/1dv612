const UserSettings = require('../../models/userSettings')

async function userDecider(body) {
    let user = ''
    let event = body.object_kind

    switch (event) {
        case 'issue':
            user = body.user.username
            break
    
        case 'push':
            user = body.user_username
            break
    
        case 'release':
            user = body.commit.author.name
            await UserSettings.findOne({name: user })
            .then(name => {
                user = name.username
            })
            break
    
        default:
            break
    }

    return user 
}

module.exports = { userDecider }