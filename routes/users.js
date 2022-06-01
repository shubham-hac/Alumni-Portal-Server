const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MIS = require('../models/MIS');
const bcrypt = require('bcrypt');

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
        console.log(error)
    }
})

//Get all users based on specific filters[course/year/role etc.]
router.post('/all',async (req,res)=>{
    try{//TODO: INCLUDE WAYS TO PAGINATE DATA
    //TODO: SANITIZE INCOMING REQUESTS!!This code is poorly written:
        const response = await User.find(req.body.filters,{pid:1,firstName:1,lastName:1,course:1,branch:1,profilePicture:1,courseJoinYear:1,courseEndyear:1})
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
router.post('/alumnis', async (req,res) => {
    try {
        if(!req.body.filters){
            const alumnis = await User.find({userType: 2})
            res.status(200).json(alumnis);
        }else{
            const filters = req.body.filters
            filters['userType'] = 2//only fetch Alumni
            const response = await User.find(filters,{firstName:1,lastName:1,course:1,branch:1,userType:1,profilePicture:1,pid:1,courseJoinYear:1,courseEndyear:1,desc:1})
            if(response.length>0){
                res.status(200).json(response)
                console.log('response',response)
            }else res.status(404).json({error:"No users were found which match the criteria"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Oops! A server error occurred!"});
    }
})


//update user
router.put('/:id', async (req,res) => {
    if(req.body.userId === req.params.id || req.body.userType === 3){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt();
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                console.log(error)
                return res.status(500).json({error: 'some server error occured !'});
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

//add user to mis db
router.post('/addtoMIS', async (req,res) => {
    try {
        if(req.body.userId === req.params.id || req.body.userType === 3) {
            const newuser = await new MIS(req.body);
            newuser.save()
            res.status(200).json(newuser);
        } else{
            res.status(404).json({error: 'Only admin can add user to MIS DB'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Oops! A server error occurred!"})
    }
})

//follow a user
router.put('/:id/follow', async (req,res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: { followers : req.body.userId } });
                await currentUser.updateOne({$push: {followings : req.params.id}});
                return res.status(200).json('User has been Followed')
            }else{
                return res.status(403).json('You already follow this user')
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        return res.status(403).json('Cant follow yourself')
    }
})

//unfollow a user
router.put('/:id/unfollow', async (req,res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: { followers : req.body.userId } });
                await currentUser.updateOne({$pull: {followings : req.params.id}});
                
                return res.status(200).json('User has been unFollowed')
            }else{
                return res.status(403).json('You dont follow this user')
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        return res.status(403).json('Cant unfollow yourself')
    }
})
//TODO: Check if the user that initiated this request is logged in and an Admin
//Toggle the ban status of a user(ban/unban a user):
router.put('/:id/toggleBan',async(req,res)=>{
    try{
        if(req.body.adminId!== req.params.id){
            const user = await User.findById(req.params.id)
            if(user){
                const toggleBan = user.banned ? false : true
                await User.updateOne({_id:req.params.id},{$set:{banned:toggleBan}})
                return res.sendStatus(200)
            }
            else return res.status(404).json({error:"This user doesn't exist!"})
        }else return res.status(403).json({error:"You can't ban yourself!"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Oops! A server error occurred!"})
    }
})
//TODO: Check if the user that initiated this request is logged in and an Admin
//Delete a user from the portal(this action is irreversible)
router.delete('/:id/delete',async(req,res)=>{
    try{
        
        if(req.body.adminId!== req.params.id){
            const user = await User.findById(req.params.id)
            if(user){
                await User.deleteOne({_id:req.params.id})
                await MIS.updateOne({pid:user.pid},{$set:{registered:false}})
                return res.sendStatus(200)
            }
            else return res.status(404).json({error:"This user doesn't exist!"})
        }else return res.status(403).json({error:"You can't delete yourself!"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Oops! A server error occurred!"})
    }
})

module.exports = router;
