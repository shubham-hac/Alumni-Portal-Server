const mongoose= require('mongoose')
const ObjectId=mongoose.Schema.objectID
const AdminHistorySchema=mongoose.Schema({
    action_type:{
        type:ObjectId,
        required:true,    
    },
    admin:{
        type:ObjectId,
        required: true,
    },
    timestamp:{
        type:Date,
        required: true
    }
    
},
{timestamps:true}
)
module.exports=mongoose.model('AdminHistory',AdminHistorySchema)