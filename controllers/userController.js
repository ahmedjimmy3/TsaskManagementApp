const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const cookie = require('cookies')
const jwt  = require('jsonwebtoken')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

let addUser =  async(req,res)=>{
    const notValidEmail = await User.findOne({email:req.body.email})
    const notValidUsername = await User.findOne({username:req.body.username})
    if(notValidEmail || notValidUsername){
        return res.status(404).json({message : "Email or username is already used before."})
    }
    else{
    const hashedPassword = await bcrypt.hash(req.body.password , 10)
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
            phone:req.body.phone,
        })
        const savedData = await newUser.save()
        const {password , ...info} = savedData._doc
        res.status(201).json({message : 'Your account is created successfully.' , ...info})
    }
}


// forgot password
let forgetPassword =async (req,res)=>{
    //1- get user with email
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send('we could not found the user with this email')
    }
    //2- generate token
    const resetToken = user.createResetPasswordToken()
    await user.save({validateBeforeSave:false})
    //3- send the token back to user
    const resetUrl = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`
    const message = `We have received a password reset request please use below link to reset your password\n\n${resetUrl}\n\n this reset password link only valid foe 10m`
    try{
        await sendEmail({
            email:user.email,
            subject:'Password change request received',
            message:message
        })
        res.status(200).json({status:'success' , message:'Password reset link send to the user email'})
    }catch(err){
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        await user.save({validateBeforeSave:false})
        return res.status(500).json({message:'There is an error sending password reset'})
    }
    
}

let resetPassword = async (req,res)=>{
    // if the user exists with the given token & token has not expired
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken: token , passwordResetTokenExpires: {$gt: Date.now()}})
    if(!user){
        return res.status(400).json({message:"Token is invalid or expired"})
    }
    // resetting the password
    const password = await bcrypt.hash(req.body.password , 10)
    user.password = password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined

    await user.save()

    const loginToken = jwt.sign({id:user._id , Admin:user.isAdmin} ,process.env.JWT_SECRET , {expiresIn:'2d'})
    res.status(200).json({loginToken})
}


let getAllUsers = async(req,res)=>{
    try {
        let users;
        const lQuery = req.query.limit
        if(lQuery){
            users = await User.find().limit(lQuery)
            return res.status(200).json({users})
        }
        users = await User.find()
        res.status(200).json({users})
    } catch (error) {
        return res.status(500).json({message : "Something went wrong."})
    }
}

let getYourInfo = async(req,res)=>{
    try{
        const user = req.params.id
        if(!user){return res.status(404).json({message:"You should provide user id"})}
        const userInfo = await User.findById(user)
        const {password , ...info} = userInfo._doc
        res.status(200).json({userInfo})
    }catch(err){
        res.status(500).json({message : "Something went wrong."})
    }
}

let updateUser = async(req,res)=>{
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password , 10)
    }
    try{
        const user = req.params.id
        if(!user){return res.status(404).json({message:"You should provide user id"})}
        const updateInfo = await User.findByIdAndUpdate(
                user,
                {$set:req.body},
                {new:true}
            )
            res.status(200).json({updateInfo})
    }catch(err){
        res.status(500).json({message : "Something went wrong."})
    }
}

let deleteUser = async(req,res)=>{
    try{
        const user = req.params.id
        await User.findByIdAndDelete(user)
        res.status(200).json({message : "This account is deleted successfully."})
    }catch(err){
        res.status(500).json({message : "Something went wrong."})
    }
}

let logOut = async(req,res)=>{
    try{
        res.clearCookie("token")
        res.setHeader("token" , "")
        res.status(200).json({message:"You Logged Success"})
    }catch(err){
        res.status(500).json({message : "Something went wrong."})
    }
}


module.exports = {
        addUser,
        getAllUsers,
        getYourInfo,
        updateUser,
        deleteUser,
        logOut,
        forgetPassword,
        resetPassword
    }    