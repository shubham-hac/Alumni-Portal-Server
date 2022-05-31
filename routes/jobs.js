const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/all', async (req,res) => {
    try {
        const events = await Job.find().sort({_id:-1});
        return res.status(200).json(events); 
    } catch (error) {
        return res.status(500).json(error);
    }
})
//Create Event
router.post('/new', async (req,res) => {
    const newJob = new Job(req.body);
    try {
        const savedJob = await newJob.save();
        res.status(200).json(savedJob);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get an Job
router.get('/', async (req,res) => {
    const jobId = req.query.jobId;
    try {
        const job = await Event.findById(jobId);
        return res.status(200).json(job);
    } catch (error) {
        return res.status(500).json(error);
    }
})
module.exports = router