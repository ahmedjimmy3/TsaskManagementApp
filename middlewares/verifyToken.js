const jwt = require('jsonwebtoken')
const cookie = require('cookies')

const verifyToken = (req,res,next)=>{
    const accessToken = req.headers.token
    if(!accessToken) return res.status(404).json({message: "You are not authenticated."})
    else{
        const token = accessToken.split(" ")[1]
        jwt.verify(token , process.env.JWT_SECRET , (err , user)=>{
            if(err) return res.status(404).json({message: "Token is not valid"})
            req.user = user
            next()
        })
    }
}

module.exports = verifyToken