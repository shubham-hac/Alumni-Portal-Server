const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/all', async (req,res) => {
    try {
        const events = await Event.find();
        return res.status(200).json(events); 
    } catch (error) {
        return res.status(500).json(error);
    }
})

//Create Event
router.post('/new', async (req,res) => {
    const newEvent = new Event(req.body);
    try {
        const savedEvent = await newEvent.save();
        res.status(200).json(savedEvent);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get an Event
router.get('/', async (req,res) => {
    const EventId = req.query.eventId;
    try {
        const event = await Event.findById(EventId);
        return res.status(200).json(event);
    } catch (error) {
        return res.status(500).json(error);
    }
})

//Update Event
router.put('/:id', async (req,res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(event.userId === req.body.userId){
            await event.updateOne({$set: req.body});
            return res.status(200).json('event updated')
        }else{
            return res.status(403).json('You can only update your event')
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

//Delete an Event
router.delete('/:id', async (req,res) => {
    try {
        
        const event = await Event.findById(req.params.id);
        console.log("\n"+req.body.userId);
        // console.log(event.userId);
        if(event.userId === req.body.userId){
            await event.deleteOne();
            return res.status(200).json('event deleted')
        }else{
            return res.status(403).json('You can only delete your event')
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports = router