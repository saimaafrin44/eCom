const mongoose = require('mongoose')

const appCategoryAndProductSchema = new mongoose.Schema({
    token: {
        type: String,
    },
    categoryToken: { // @relation
        type: String
    },
    categoryDetails: { // @record
        type: Object
    },
    productToken: { // @relation
        type: String
    },
    productDetails: { // @record
        type: Object
    },
    productOrigin:{ // @productObject.origin
        type: Object
    },
    position: {
        type: Number
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

module.exports = mongoose.model('AppCategoryAndProduct', appCategoryAndProductSchema)