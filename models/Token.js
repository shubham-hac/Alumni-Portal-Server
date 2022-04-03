const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId
const TokenSchema = mongoose.Schema({
    user_id:{
        type: ObjectId,
        required: true,
        ref: 'users'
    },
    token:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        index: {expires:'15m'}
    }
}) 
module.exports = mongoose.model('Token',TokenSchema)