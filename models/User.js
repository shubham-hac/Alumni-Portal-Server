const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        Min: 3,
        Max: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        Max: 50,
        unique: true
    },
    pid: {
        type: String,
        Max: 9,
        Min: 9,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        Max: 10,
        Min: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        Min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    userType: {
        type: Number,
        enum: [1,2,3],
        default: 1
    },
    desc: {
        type: String,
        Max: 50
    },
    address: {
        type: String,
        Max: 200,
        default: ""
    },
    birthDate: {
        type: Date,
    },
    gender: {
        type: Number,
        enum: [1,2],
        default: 1,
    },
    collegeName:  {
        type: String,
        default: "St. John college of Engineering and Management"
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
    courseEndyear: {
        type: Date,
    }
},
{timestamps: true}
)

module.exports = mongoose.model('User', UserSchema);