const mongoose = require('mongoose');

const StorySchema = mongoose.Schema({
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
    storyImage: {
        type: String,
        default: ""
    },
    views: {
        type: Array,
        default: []
    }
}, 
{timestamps: true}
)

module.exports = mongoose.model('Story', StorySchema);