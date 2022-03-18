function messageFormatter(data, type) {
    let message = ''
    let event = data.object_kind
    let linebreak = ' '
    if (type === 'discord') {linebreak ='\n'}
    if (type === 'client') {linebreak =`-`}

    if(event === 'issue') {
        message = `You have received a new ${event} named "${data.object_attributes.title}".
        ${linebreak}Repository: ${data.repository.name}.
        ${linebreak}User: ${data.user.name}.
        ${linebreak}Link: ${data.object_attributes.url}`
    }
    else if (event === 'push') {
        message = `You have received a new ${event} named "${data.commits[0].title}".
        ${linebreak}Author: ${data.commits[0].author.name}
        ${linebreak}Link: ${data.commits[0].url}`
    }
    else if (event === 'release') {
        message = `You have received a new ${event} named "${data.name}".
        ${linebreak}Author: ${data.commit.author.name}.
        ${linebreak}Link: ${data.url}`
    }
    return message
}

module.exports = { messageFormatter }