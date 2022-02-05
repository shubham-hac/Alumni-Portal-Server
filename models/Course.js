const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    startYear: {
        type: Date,
        required: true,
        default: Date.now
    },
    totalStudents: {
        type: Number,
        required: true
    },
    branches:{
        type: Array,
    }
}, 
{timestamps: true}
)

module.exports = mongoose.model('Course', CourseSchema);