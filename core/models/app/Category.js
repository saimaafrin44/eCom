const mongoose = require('mongoose')

const appCategorySchema = new mongoose.Schema({
    token: {
        type: String,
    },
    title: {
        type: String
    },
    slug: {
        type: String
    },
    flowType: { // menuItem/standalone
        type: String
    },
    positionKey: {
        type: Number
    },
    images: {
        type: Object
    },
    parents: {
        type: Object
    },
    children: {
        type: Object
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

module.exports = mongoose.model('AppCategory', appCategorySchema)