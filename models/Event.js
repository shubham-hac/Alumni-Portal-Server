const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        max: 80,
        required: true
    },
    desc: {
        type: String,
        required: true,
    },
    eventImage: {
        type: String,
        default: ""
    },
    scheduleDate: {
        type: Date,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    views: {
        type: Array,
        default: []
    }
}, 
{timestamps: true}
)

module.exports = mongoose.model('Event', EventSchema);