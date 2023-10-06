const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const cookie = require('cookies')


// login user
router.post('/login', async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user){ return res.status(401).json({message:"Username or password is incorrect."})}
        const password = await bcrypt.compare(req.body.password , user.password)
        if(!password){ return res.status(401).json({message:"Username or password is incorrect."})}

        const accessToken = jwt.sign(
            {id:user._id , Admin:user.isAdmin} , 
            process.env.JWT_SECRET ,
            {expiresIn:'2d'}
        )
        res.cookie("token" , accessToken , {httpOnly:true})
        res.setHeader("token" , accessToken , {httpOnly:true})
        res.status(200).json({message : "You are logged successfully." , accessToken})
    }catch(error){
        res.status(500).json({message:"Something went wrong." ,error })
        console.log(error)
    }
})



module.exports = router 