const mongoose = require('mongoose')

const sysSessionSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    appToken: {
        type: String
    },
    userToken: {
        type: String
    },
    userAgent: {
        type: Object
    },
    ipAddress: {
        type: String
    },
    source: {
        type: String
    },
    startingDeviceToken: {
        type: String
    },
    endingDeviceToken: {
        type: String
    },
    endedAt: {
        type: Date
    },
    status: {
        type: String
    },
    existence: {
        type: String 
    },
    createdBy: { // @relation
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    activityToken: { // @relation
        type: String
    }
})

module.exports = mongoose.model('SysSession', sysSessionSchema)