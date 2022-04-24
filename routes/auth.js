const express = require('express');
const router = express.Router();
const dotenv = require('dotenv')
dotenv.config({path:".env"})
const User = require('../models/User');
const Token = require('../models/Token')
const MIS = require('../models/MIS')
const twilioClient = require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN)
const otpgen = require('otp-generator')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
router.get('/', (req,res) => {
    res.send('Auth')
})

//find user route(checks whether a user with the given email/phone no/email is in the MIS db):
router.post('/find', async (req,res)=>{
    try{
        const uniqueField = [Object.keys(req.body)[0]]
        //If the very first field in the request object was modified by the attacker,there is a chance of leaking the existence of a particular user/user's PII.
        //So ensure the first field is one of these:
        if(uniqueField=='email' || uniqueField=='mobile' || uniqueField=='pid'){
            const searchObject={}
            searchObject[uniqueField]=req.body[uniqueField]
            const mis_record = await MIS.findOne(searchObject)
            console.log(mis_record)
            if(mis_record==null){
                return res.status(404).json({error:'No student/alumni was found whose data matches yours'})
            }//In case someone tries to re-register the same person again:
            else if(mis_record.registered==true) return res.status(400).json({error:'This student/alumni is already registered'})
            else{
                //Ensure that the username isnt already taken:
                const user = await User.findOne({username:req.body.username})
                if(user){
                    return res.status(409).json({error:'This username is already taken'})
                }else return res.sendStatus(200)
            }
        }
        else{
            return res.status(500).json({error:'Bad Request. Malignant activity detected'})
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error:'Oops! A server error occurred!'})
    }
})

router.post('/fetchMethods',async(req,res)=>{
    try{
        const pid = req.body.pid
        console.log(pid)
        mis_record = await MIS.findOne({pid: pid})
        if(mis_record){
            const respObj={}
            if(mis_record.email) respObj['email'] = mis_record.email
            if(mis_record.mobile) respObj['mobile'] = mis_record.mobile
            return res.status(200).json(respObj)
        }else return res.status(404).json({error:"No student/alumni was found whose data matches yours"})
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Oops! A server error occurred"})
    }
})

//TODO: (Maybe) accomodate resending emails in case something goes wrong the first time:
//Generates a Cryptographically Secure Pseudo Random Number OTP and emails it to the user:
router.post('/sendMail',async (req,res)=>{
    try{
        let mis_record = null
        let isPID = false //flag for whether the user entered their PID(true) or their email(false)
        if(req.body.pid){
            mis_record = await MIS.findOne({pid: req.body.pid})
            isPID = true
        }
        else if(req.body.email){
            mis_record = await MIS.findOne({email: req.body.email})
        }
        else{
            return res.status(400).json({error:'Bad Request'})
        }
        if(mis_record){
            //generates a cryptographically secure 6 digit long code:
            const otp = otpgen.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
            //Store the OTP in DB:
            const newToken = await new Token({user_id: mis_record._id,token: otp})
            newToken.markModified('token')
            const saveToken = await newToken.save(function(err, doc) {
  if (err) return console.error('Error:',err);
  console.log("Document inserted succussfully!");
}) 
            console.log('Token saved: ',saveToken) //TODO: REMOVE DEBUG OUTPUT
            //Now send the email containing the OTP to the user's email id:
            const sendEmail = require('../utils/sendEmail')
            const fname = mis_record.fname
            await sendEmail(mis_record.email,"Verify your email address",ejs.renderFile('./templates/verifyEmail.ejs',{fname,otp}))
            //This function will hide all chars in the email address except the first 2 digits and the domain name:
            const hideEmail =(email)=>{
                return email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3)=>{ 
                    for(let i = 0; i < gp3.length; i++) { 
                    gp2+= "*"; 
                    } return gp2; 
                })
            }
            //If the user entered a PID, they should be trusted less and therefore should only get to see the hidden email address:
            const responseData={email:isPID?hideEmail(mis_record.email):mis_record.email}
            return res.status(200).json(responseData)
        }
        else //yes,this will probably not get triggered at this stage of the sign-up process,but good to keep it anyway:
        return res.status(404).json({error: 'No student/alumni was found whose data matches yours'})
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Oops! A server error occurred!"})
    }  
})

//Generates a Cryptographically Secure Pseudo Random Number OTP and sends it to the user via SMS:
router.post('/sendSMS',async (req,res)=>{
    try{
        let mis_record = null
        let isPID = false //flag for whether the user entered their PID(true) or their mobile(false)
        if(req.body.pid){
            mis_record = await MIS.findOne({pid: req.body.pid})
            isPID = true
        }
        else if(req.body.mobile){
            console.log(req.body.mobile)
            mis_record = await MIS.findOne({mobile: req.body.mobile})
        }
        else{
            return res.status(400).json({error:'Bad Request'})
        }
        if(mis_record){
            //generates a cryptographically secure 6 digit long code:
            const otp = await otpgen.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
            //Store the OTP in DB:
            const newToken = await new Token({user_id: mis_record._id,token: otp})
            await newToken.save(function(err, doc) {
  if (err) return console.error('Error:',err);
  console.log("Document inserted succussfully!");
})
            
            //Now send the SMS containing the OTP to the user's phone:
            const mobile = mis_record.mobile
            const response = await twilioClient.messages.create({
                body: `Dear ${mis_record.fname},\n Greetings from SJCEM,Palghar. Your OTP to register for the Alumni Portal is ${otp}. Valid for 15 minutes.`,
                from:process.env.TWILIO_REG_NUMBER,
                to:`+91${mobile}`
            })
            if(response.status=='undelivered' || response.status=='failed') return res.status(500).json({error:"SMS not sent"})
            //This function will hide all chars in the phone no. except the first 2 digits and the domain name:
            const hidden_mob= mobile.slice(0, 2) + mobile.slice(2).replace(/.(?=...)/g, '*')
            //If the user entered a PID, they should be trusted less and therefore should only get to see the hidden phone number:
            const responseData={mobile:isPID?hidden_mob:mobile}
            return res.status(200).json(responseData)
        }
        else //yes,this will probably not get triggered at this stage of the sign-up process,but good to keep it anyway:
        return res.status(404).json({error: 'No student/alumni was found whose data matches yours'})
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Oops! A server error occurred!"})
    }  
})

//Verifies the OTP sent via phone or mail:
router.post('/verifyOTP',async (req,res)=>{
    try{
    const uniqueField = [Object.keys(req.body)[0]]
    //If the very first field in the request object was modified by the attacker,there is a chance of leaking the existence of a particular user/user's PII.
        //So ensure the first field is one of these:
        if(uniqueField=='email' || uniqueField=='mobile' || uniqueField=='pid'){
            const searchObject = {}
            searchObject[uniqueField]=req.body[uniqueField]
            //Find the alumni/student record of the user:
            const mis = await MIS.findOne({searchObject})
            if(mis){
                //Obtain the OTP sent to the mail/phone of the user with the help of their unique id:
                const token = await Token.findOne({user_id:mis._id,token:req.body.otp})
                if(token){
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password, salt);
                    const user = await new User({
                        pid: mis.pid,
                        firstName: mis.fname,
                        middleName: mis.mname,
                        lastName: mis.lname,
                        username: req.body.username,
                        password: hashedPassword,
                        userType: mis.courseEndYear?1:0, //If the user has already ended their course,theyre an alumni[1] otherwise, they're a student [type 0]
                        email: mis.email,
                        mobile: mis.mobile,
                        course: mis.course,
                        branch: mis.branch,
                        address: mis.address,
                        birthDate: mis.birthDate,
                        courseJoinYear: mis.courseJoinYear,
                        courseEndYear: mis.courseEndYear,
                        
                        //TODO: USERTYPE AND GENDER NEED TO BE ADDED
                    })
                    await Token.deleteOne(token)
                    await user.save()
                    await MIS.updateOne({_id:mis._id},{$set:{registered:true}})
                    return res.sendStatus(200)
                }else return res.status(409).json({error:'Invalid OTP'})
            }else return res.status(404).json({error:'No student/alumni was found whose data matches yours'}) //technically,this should never get triggered at this stage,but better safe than sorry
        }else{
            return res.status(400).json({error:'Bad Request. Malignant activity detected'})
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Oops! A server error occurred!"})
    }
})

//Login Route
router.post('/login', async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user == null)
            return res.status(404).json('User Not found');
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword)
            return res.status(400).json('Wrong Password');
        
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
