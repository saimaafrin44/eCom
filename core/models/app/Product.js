const mongoose = require('mongoose')

const appProductSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    title: {
        type: String
    },
    slug: {
        type: String
    },
    sku: {
        type: String
    },
    shortDetails: {
        type: String
    },
    details: {
        type: String
    },
    images: {
        type: Object
    },
    regularPrice: {
        type: Number
    },
    discountedPrice: {
        type: Number
    },
    countablePrice: {
        type: Number
    },
    eatable: { // Yes/No
        type: String
    },
    nutritionalValues: {
        type: Object
    },
    origin: { // Fresh/Regular/Preorder
        type: String
    },
    status: { // Active/Inactive
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

module.exports = mongoose.model('AppProduct', appProductSchema) 