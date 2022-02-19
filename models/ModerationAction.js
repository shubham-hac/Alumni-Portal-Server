const mongoose= require('mongoose')
const ModerationActionSchema=mongoose.Schema({
    atype:{
        type:String,
        required: true,
        unique: true
    },
    desc:{
        type:String,
        max: 30,
        required: true
    }
    },
    {timestamps: true}
)
module.exports=mongoose.model('ModerationAction',ModerationActionSchema)