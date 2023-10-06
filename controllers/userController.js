const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const cookie = require('cookies')
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
        logOut
    }    