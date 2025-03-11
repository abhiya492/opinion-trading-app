const express = require('express');
const router = express.Router();
const Trade = require('../models/trade.model');
const Event = require('../models/event.model');
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');
const logger = require('../config/logger');

// Get user's trades
router.get('/my-trades', auth, async (req, res) => {
    try {
        const trades = await Trade.find({ user: req.user._id })
            .populate('event', 'title status')
            .sort({ createdAt: -1 });

        res.json(trades);
    } catch (error) {
        logger.error(`Get Trades Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching trades' });
    }
});

// Place new trade
router.post('/', auth, async (req, res) => {
    try {
        const { eventId, selectedOption, amount } = req.body;

        // Validate event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.status !== 'upcoming' && event.status !== 'live') {
            return res.status(400).json({ message: 'Event is not available for trading' });
        }

        // Validate option
        const option = event.options.find(opt => opt.text === selectedOption);
        if (!option) {
            return res.status(400).json({ message: 'Invalid option selected' });
        }

        // Check user balance
        if (req.user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create trade
        const trade = new Trade({
            user: req.user._id,
            event: eventId,
            selectedOption,
            amount,
            odds: option.odds,
            potentialWinnings: amount * option.odds
        });

        // Update user balance
        req.user.balance -= amount;
        await req.user.save();

        // Update event volume
        event.totalVolume += amount;
        await event.save();

        await trade.save();

        res.status(201).json(trade);
    } catch (error) {
        logger.error(`Place Trade Error: ${error.message}`);
        res.status(500).json({ message: 'Error placing trade' });
    }
});

// Get trade details
router.get('/:id', auth, async (req, res) => {
    try {
        const trade = await Trade.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('event', 'title status options');

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        res.json(trade);
    } catch (error) {
        logger.error(`Get Trade Error: ${error.message}`);
        res.status(500).json({ message: 'Error fetching trade' });
    }
});

// Cancel trade (if event hasn't started)
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const trade = await Trade.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'pending'
        }).populate('event');

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found or cannot be cancelled' });
        }

        if (trade.event.status !== 'upcoming') {
            return res.status(400).json({ message: 'Cannot cancel trade after event has started' });
        }

        // Refund user
        const user = await User.findById(req.user._id);
        user.balance += trade.amount;
        await user.save();

        // Update trade status
        trade.status = 'cancelled';
        await trade.save();

        // Update event volume
        trade.event.totalVolume -= trade.amount;
        await trade.event.save();

        res.json(trade);
    } catch (error) {
        logger.error(`Cancel Trade Error: ${error.message}`);
        res.status(500).json({ message: 'Error cancelling trade' });
    }
});

module.exports = router; 