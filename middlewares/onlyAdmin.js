// This middleware only allows requests made by users that are admins:
const onlyAdmin = (req,res,next)=>{
  if(req.user.userType === 3)
    next()
  else return res.status(403).json({error:"You are not authorized to perform this action"})
}
module.exports = onlyAdmin
