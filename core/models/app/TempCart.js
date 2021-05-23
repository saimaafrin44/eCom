const mongoose = require('mongoose')

const appTempCartSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    deviceToken: {
        type: String
    },
    
    // Common Column Field
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
    },
    updateHistory: {
        type: Object
    },
    statusHistory: {
        type: Object
    },
    existenceHistory: {
        type: Object
    }
    
})

module.exports = mongoose.model('AppTempCart', appTempCartSchema)