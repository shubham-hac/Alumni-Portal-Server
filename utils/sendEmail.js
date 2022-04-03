const nodemailer= require("nodemailer")
const dotenv = require('dotenv')
const { render } = require("express/lib/response")
console.log(dotenv.config({path:'.env'}))
module.exports = async (to,subject,message)=>{
    try {
        const transporter= nodemailer.createTransport({
            
            host: process.env.EMAIL_HOST,
            post: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.EMAIL_SECURE),
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: await message
        }) 
    } catch (error) {
        console.log(error)
    }
}