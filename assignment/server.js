const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan')
const path = require('path')
const session = require('express-session')

require('dotenv').config()
require('./configs/mongoose')
const { socketList } = require('./api/middlewares/utility/socketHandler')

PORT = process.env.PORT || 3001

const app = express()

const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8, // 8 hour
    sameSite: 'lax'
  }
}
    
//Middleware
app.use(helmet({contentSecurityPolicy: false}))
app.use(cors())
app.use(logger('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session(sessionOptions))

// Server
let server = app.listen(PORT, () => {
    console.log(`Server is currently running on port: ${PORT}`)
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  socket.emit('userConnected')
  socket.on('socketLogin', data => {
    if(data.userId) {
      socketList[socket.id] = data.userId
    }
  })
  socket.on('disconnect', () => {
    delete socketList[socket.id]
  })
})
app.set('socketio', io)


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'GET, PUT, POST, PATCH, DELETE')
        // return res.status(200).json({})
    }
    next()
})


// Routes
app.use('/api/v1/users', require('./api/routes/userRoute'))
app.use('/api/v1/notifications', require('./api/routes/notificationRoute'))

// Serve static assets if production
if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html' ))
  })
}

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found.')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})

