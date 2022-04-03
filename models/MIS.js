const mongoose = require('mongoose')
const MISSchema= mongoose.Schema({
    pid:{
        type: String,
        max:10,
        min:7,
        unique: true,
        required: true
    },
    fname:{
        type: String,
        max: 50,
        required: true
    },
    mname:{
        type: String,
        max: 50,
        required: true
    },
    lname:{
        type: String,
        max: 50,
        required: true
    },
    email:{
        type: String,
        max: 50,
        required: true,
        unique: true
    },
    mobile:{
        type: String,
        max:10,
        min:10,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        default: ""
    },
    courseJoinYear: {
        type: Date,
        required: true
    },
    courseEndYear: {
        type: Date,
    },
    courseDuration:{
        type: Number,
    },
    institute:{
        type: String,
        //*TODO: ADD ENUM INSTEAD
        default:'St. John college of Engineering and Management',
        required: true,
        
    },
    birthDate:{
        type:Date,
        required: true
    },
    address:{
        type: String,
        max:200,
        required: true
    },
    registered:{
        type: Boolean,
        default: false,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('MIS',MISSchema)