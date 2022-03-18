const mongoose = require('mongoose')
require('dotenv').config()

// Taken from my 1DV527 API assignment.
mongoose.connection.on('connected', () => console.log('DB connection is open.'))
mongoose.connection.on('error', err => console.error(`DB connection error has occurred: ${err}`))
mongoose.connection.on('disconnected', () => console.log('DB connection is disconnected.'))

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('DB connection is disconnected due to application termination.')
        process.exit(0)
    })
})

// Connection
mongoose.connect(process.env.MONGODB_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('DB connected.'))
    .catch(error => {
    console.log(error)
    process.exit(1)
})

module.exports = mongoose