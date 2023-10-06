const verifyToken = require('./verifyToken')
const jwt = require('jsonwebtoken')


const verifyAndAuthorized = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.Admin){
            next()
        } 
        else{
            return res.status(403).json({message : "You are not allowed"})
        }
    })
}

module.exports = verifyAndAuthorized