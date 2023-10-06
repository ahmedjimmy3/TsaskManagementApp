const verifyToken = require('./verifyToken')
const jwt = require('jsonwebtoken')

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if( req.user.Admin ){
            next()
        }
        else{
            return res.status(403).json({message : "You are not allowed"})
        }
    })
}

module.exports = verifyTokenAndAdmin