const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const logger = require('../config/logger');

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const { status, category } = req.query;
        const query = {};

        if (status) query.status = status;
        if (category) query.category = category;

        const events = await Event.find(query)
            .sort({ startTime: 1 })
            .populate('createdBy', 'username');

        res.json(events);
    } catch (error) {
        logger.error(`Get Events Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get single event
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'username');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        logger.error(`Get Event Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching event' });
    }
});

// Create new event (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            startTime,
            endTime,
            options
        } = req.body;

        const event = new Event({
            title,
            description,
            category,
            startTime,
            endTime,
            options,
            createdBy: req.user._id
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        logger.error(`Create Event Error: ${error.message}`);
        res.status(500).json({ message: 'Error creating event' });
    }
});

// Update event (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            event[key] = updates[key];
        });

        await event.save();
        res.json(event);
    } catch (error) {
        logger.error(`Update Event Error: ${error.message}`);
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Settle event (admin only)
router.post('/:id/settle', adminAuth, async (req, res) => {
    try {
        const { correctOption } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.status === 'completed') {
            return res.status(400).json({ message: 'Event already settled' });
        }

        event.status = 'completed';
        event.options = event.options.map(option => ({
            ...option,
            isCorrect: option.text === correctOption
        }));

        await event.save();
        res.json(event);
    } catch (error) {
        logger.error(`Settle Event Error: ${error.message}`);
        res.status(500).json({ message: 'Error settling event' });
    }
});

module.exports = router; 