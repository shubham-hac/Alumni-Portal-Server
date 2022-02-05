const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
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
    location:{
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

module.exports = mongoose.model('Event', JobSchema);