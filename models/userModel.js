const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        phone:{
            type:Number,
        },
        isAdmin:{
            type:Boolean,
            default:false,
        },
        passwordResetToken:String,
        passwordResetTokenExpires:Date
    } ,
    {timestamps:true}
)
userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000
    console.log(resetToken , this.passwordResetToken )
    return resetToken
}

module.exports = mongoose.model("User" , userSchema)