const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req,res) => {
    res.send('Auth')
})

//Register route
router.post('/register', async (req,res) => {
    try {
        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create User
        const user = await new User({
            firstName: req.body.firstName,
            lastName: req.body. lastName,
            username: req.body.username,
            email: req.body.email,
            pid: req.body.pid,
            mobile: req.body.mobile,
            userType: req.body.userType,
            course: req.body.course,
            branch: req.body.branch,
            courseJoinYear: req.body.courseJoinYear,
            userType: req.body.userType,
            password: hashedPassword,
        })
        await user.save();
        return res.send(user)
    } catch (error) {
        return res.status(500).json(error);
    }
})

//Login Route


module.exports = router;
