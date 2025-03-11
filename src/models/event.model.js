const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['sports', 'politics', 'entertainment', 'other']
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    options: [{
        text: String,
        odds: Number,
        isCorrect: {
            type: Boolean,
            default: null
        }
    }],
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalVolume: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
eventSchema.index({ status: 1, startTime: 1 });
eventSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema); 