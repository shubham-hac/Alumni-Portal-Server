const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MIS = require('../models/MIS');
const bcrypt = require('bcrypt');

// router.get('/', (req,res) => {
//     res.send('user route')
// })

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

//get alumnis
router.get('/alumnis', async (req,res) => {
    try {
        const alumnis = await User.find({userType: 2})
        res.status(200).json(alumnis);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get alumni filter
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

module.exports = router;
