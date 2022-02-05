const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/all', async (req,res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/', async (req,res) => {
    try {
        const savedCourse = await Course.create(req.body);
        res.status(200).json(savedCourse);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;