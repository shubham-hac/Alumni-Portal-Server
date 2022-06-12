const express = require('express');
const router = express.Router();

const Event = require('../models/Event');

const noStudent = require('../middlewares/noStudent')
const accessStatus = require('../middlewares/accessStatus')
router.get('/all', async (req,res) => {
    try {
        const events = await Event.find().sort({_id:-1});
        return res.status(200).json(events); 
    } catch (error) {
        return res.status(500).json(error);
    }
})

//Create Event
router.post('/new',[accessStatus,noStudent],async (req,res) => {
    //Add the user id of the user that created this event:
    console.log(req.user._id)
    req.body.newEvent['userId'] = req.user._id
    const newEvent = new Event(req.body.newEvent);
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
router.put('/:id',[accessStatus,noStudent], async (req,res) => {
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
router.delete('/:id',[accessStatus,noStudent], async (req,res) => {
    try {
        
        const event = await Event.findById(req.params.id);
        console.log("\n"+req.body.userId);
        // console.log(event.userId);
        if(event.userId === req.body.userId || req.body.userType === 3){
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
