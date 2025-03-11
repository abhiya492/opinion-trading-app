const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const Trade = require('../models/trade.model');
const User = require('../models/user.model');
const { adminAuth } = require('../middleware/auth.middleware');
const logger = require('../config/logger');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        logger.error(`Admin Get Users Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Update user status
router.put('/users/:id/status', adminAuth, async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        logger.error(`Admin Update User Status Error: ${error.message}`);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// Get all trades
router.get('/trades', adminAuth, async (req, res) => {
    try {
        const trades = await Trade.find()
            .populate('user', 'username email')
            .populate('event', 'title status')
            .sort({ createdAt: -1 });

        res.json(trades);
    } catch (error) {
        logger.error(`Admin Get Trades Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching trades' });
    }
});

// Settle trades for an event
router.post('/events/:id/settle-trades', adminAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.status !== 'completed') {
            return res.status(400).json({ message: 'Event must be completed to settle trades' });
        }

        const correctOption = event.options.find(opt => opt.isCorrect);
        if (!correctOption) {
            return res.status(400).json({ message: 'No correct option set for the event' });
        }

        // Get all pending trades for this event
        const trades = await Trade.find({
            event: event._id,
            status: 'pending'
        }).populate('user');

        // Process each trade
        for (const trade of trades) {
            const won = trade.selectedOption === correctOption.text;
            trade.status = won ? 'won' : 'lost';
            trade.settledAmount = won ? trade.potentialWinnings : 0;
            trade.settledAt = new Date();

            if (won) {
                trade.user.balance += trade.potentialWinnings;
                await trade.user.save();
            }

            await trade.save();
        }

        res.json({ message: 'Trades settled successfully', settledTrades: trades.length });
    } catch (error) {
        logger.error(`Admin Settle Trades Error: ${error.message}`);
        res.status(500).json({ message: 'Error settling trades' });
    }
});

// Get system statistics
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalEvents: await Event.countDocuments(),
            totalTrades: await Trade.countDocuments(),
            activeEvents: await Event.countDocuments({ status: { $in: ['upcoming', 'live'] } }),
            completedEvents: await Event.countDocuments({ status: 'completed' }),
            totalTradeVolume: await Trade.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).then(result => result[0]?.total || 0)
        };

        res.json(stats);
    } catch (error) {
        logger.error(`Admin Get Stats Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

module.exports = router; 