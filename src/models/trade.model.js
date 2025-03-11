const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    selectedOption: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    odds: {
        type: Number,
        required: true
    },
    potentialWinnings: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'won', 'lost', 'cancelled'],
        default: 'pending'
    },
    settledAmount: {
        type: Number,
        default: 0
    },
    settledAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for faster queries
tradeSchema.index({ user: 1, status: 1 });
tradeSchema.index({ event: 1, status: 1 });

module.exports = mongoose.model('Trade', tradeSchema); 