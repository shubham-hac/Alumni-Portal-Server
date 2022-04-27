const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

router.get('/all', async (req,res) => {
    try {
        const storys = await Story.find().sort({_id:-1});
        return res.status(200).json(storys); 
    } catch (error) {
        return res.status(500).json(error);
    }
})

//Create story
router.post('/new', async (req,res) => {
    const newStory = new Story(req.body);
    try {
        const savedStory = await newStory.save();
        res.status(200).json(savedStory);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get a story
router.get('/', async (req,res) => {
    const storyId = req.query.storyId;
    try {
        const story = await Story.findById(storyId);
        return res.status(200).json(story);
    } catch (error) {
        return res.status(500).json({error: "Something went wrong"});
    }
})

//Update story
router.put('/:id', async (req,res) => {
    try {
        const story = await Story.findById(req.params.id);
        if(story.userId === req.body.userId){
            await Story.updateOne({$set: req.body});
            return res.status(200).json('story updated')
        }else{
            return res.status(403).json('You can only update your story')
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

//Delete an story
router.delete('/:id', async (req,res) => {
    try {
        
        const story = await Story.findById(req.params.id);
        console.log("\n"+req.body.userId);
        // console.log(story.userId);
        if(story.userId === req.body.userId || req.body.userType === 3){
            await Story.deleteOne();
            return res.status(200).json('story deleted')
        }else{
            return res.status(403).json('You can only delete your story')
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports = router