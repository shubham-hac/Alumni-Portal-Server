const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    
}, 
{timestamps: true}
)

module.exports = mongoose.model('Event', JobSchema);