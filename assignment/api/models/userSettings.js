const mongoose = require('mongoose')

/* TODO: https://stackoverflow.com/questions/61175684/mongoose-schema-how-to-set-max-number-of-items-in-an-array */
const userSettingsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        unique: true,
        required: true
    },
    username: { 
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        requried: true
    },
    groupSetting: {
        type: String,
    },
    hookUrl: { 
        type: String,
        unique: true
    },
    notifications: [
        {
            data: String
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('userSettings', userSettingsSchema)