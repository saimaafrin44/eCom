const mongoose = require('mongoose')

const appUserCartDetailsSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    readableToken: {
        type: String
    },
    deviceToken: {
        type: String
    },
    productToken: {
        type: String
    },
    units: { 
        type: Number
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

module.exports = mongoose.model('AppUserCartDetails', appUserCartDetailsSchema)