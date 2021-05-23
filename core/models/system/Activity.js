const mongoose = require('mongoose')

const sysActivitySchema = new mongoose.Schema({
    token: {
        type: String,
    },
    origin: {
        type: String
    },
    deviceToken: {
        type: String
    },
    deviceSessionToken: {
        type: String
    },
    appToken: {
        type: String
    },
    userToken: {
        type: String
    },
    sessionToken: {
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
    requestMethod: {
        type: String
    },
    requestedTo: {
        type: String
    },
    endpoint: {
        type: String
    },
    originalURL: {
        type: String
    },
    request: {
        type: Object
    },
    requestSizeInBytes: {
        type: String
    },
    responseType: {
        type: String
    },
    responseMessage: {
        type: Object
    },
    response: {
        type: Object
    },
    responseSizeInBytes: {
        type: String
    },
    requestTime: {
        type: Number
    },
    responseTime: {
        type: Number
    },
    elapsedTime: {
        type: Number
    },
    errorLog: {
        type: Object
    }, 
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('SysActivity', sysActivitySchema)