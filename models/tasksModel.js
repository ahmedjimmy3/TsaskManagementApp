const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        desc:{
            type:String,
            required:true,
        },
        status:{
            type:String,
            default:"unavailable",
        },
        priority:{
            type:String,
        },
        userId:{
            required:true,
            type:String
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model('Task' , taskSchema)