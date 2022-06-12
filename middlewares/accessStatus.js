const jwt = require('jsonwebtoken')
const env = require('dotenv')
env.config()

const accessStatus = (req,res,next)=>{
    //Get the contents of the authorization header:
    const authHeader = req.headers['authorization']
    //If authHeader is not null, extract the token from the header's value:
    const accessToken = authHeader && authHeader.split(' ')[1]
    if(accessToken == null) return res.status(401).json({error:"Please login first!"})
    
    //If the auth token is present, verify it:
    jwt.verify(accessToken,process.env.ACCESS_KEY,(err,user)=>{
        if(err){
            console.log(err)
            return res.status(403).json({error:"Invalid access token!"})
        }
        //If the verification succeeds, attach the user object to the req:
        req.user = user
        next()
    })
}

module.exports = accessStatus
