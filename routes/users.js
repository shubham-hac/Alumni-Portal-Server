const express = require('express');
const router = express.Router();
const User = require('../models/User');

//get a user
router.get('/', async (req,res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId 
            ? await User.findById(userId)
            : await User.findOne({username: username});
        const {password,updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get all users based on specific filters[course/year/role etc.]
router.post('/all',async (req,res)=>{
    try{//TODO: INCLUDE WAYS TO PAGINATE DATA
    //TODO: SANITIZE INCOMING REQUESTS!!This code is poorly written:
        const response = await User.find(req.body.filters,{firstName:1,lastName:1,course:1,branch:1,userType:1,profilePicture:1,pid:1,courseJoinYear:1,courseEndyear:1})
        if(response.length>0){
            res.status(200).json(response)
            console.log('response',response)
        }
        else res.status(404).json({error:"No users were found which match the criteria"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
})

//get alumnis
router.get('/alumnis', async (req,res) => {
    try {
        const alumnis = await User.find({userType: 2})
        res.status(200).json(alumnis);
    } catch (error) {
        res.status(500).json(error);
    }
})

//update user
router.put('/:id', async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt();
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body,
            })
            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json('You can only update your account');
    }
})

module.exports = router;
