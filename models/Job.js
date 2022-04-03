const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.ObjectId
const JobSchema = mongoose.Schema({
    postedBy: {
        type: ObjectId,
        required: true
    },
    offered_role: {
        type: String,
        max: 80,
        required: true
    },
    companyName: {
        type: String,
        max: 80,
        required: true
    },
    postedOn: {
        type: Date,
        required: true
    },
    deadline:{
        type: Date,
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