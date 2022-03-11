const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
            return res.status(200).json('account updated succesfully')
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json('You can only update your account');
    }
})

module.exports = router;
