const mongoose = require('mongoose')

const RefreshTokenSchema = mongoose.Schema({
  refresh_token :{
    type: String,
    required: true,
    unique: true    
  },
  createdAt:{
  type: Date,
    default: Date.now(),
    index: {expires: '1d'}
  }
})
module.exports = mongoose.model('RefreshToken',RefreshTokenSchema)
