const mongoose = require('mongoose')

const AuditTrailSchema = new mongoose.Schema(
    {
        actor:{ type:String },
        action:{ type:String },
        type: {type:String},
    },
    {timestamps:true}
)

module.exports = mongoose.model('auditTrail' , AuditTrailSchema)