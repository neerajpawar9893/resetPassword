const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const colonySchema = new Schema({
    state: {
        type: String
    },
    city: {
        type: String
    },
    colonyName: {
        type: String
    },
    area: {
        type: String
    },
    colonySize: {
        type: String
    },
    noOfPlot: {
        type: String
    },
    date: {
        type: Date
    },
    address: {
        type: String
    },
    otherInfo: {
        type: String
    },
    userId: {
        type: String
    },
    is_deleted: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

module.exports = mongoose.model('colony', colonySchema);