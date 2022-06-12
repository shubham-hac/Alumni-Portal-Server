// This middleware only allows requests made by users that are either admins or alumni:
const noStudent = (req,res,next)=>{
  if(req.user.userType != 1)
    next()
  else return res.status(403).json({error:"You are not authorized to perform this action"})
}
module.exports = noStudent
