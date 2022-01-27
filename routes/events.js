const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/', (req,res) => {
    res.send('Events')
})

router.post('/', async (req,res) => {
    const newEvent = new Event(req.body);
    try {
        const savedEvent = await newEvent.save();
        res.status(200).json(savedEvent);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router