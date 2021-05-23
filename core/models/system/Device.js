const mongoose = require('mongoose')

const sysDeviceSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    deviceSessionToken: {
        type: String
    },
    appToken: {
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
    deviceId: {
        type: String
    },
    deviceInfo: {
        type: String
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

module.exports = mongoose.model('SysDevice', sysDeviceSchema)