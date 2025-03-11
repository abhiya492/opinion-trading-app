const axios = require('axios');
const logger = require('../config/logger');
const Event = require('../models/event.model');

class ExternalApiService {
    constructor(socketService) {
        this.socketService = socketService;
        this.apiKey = process.env.API_KEY;
        this.baseUrl = process.env.EXTERNAL_API_URL || 'https://api.example.com';
    }

    async fetchLiveEvents() {
        try {
            const response = await axios.get(`${this.baseUrl}/live-events`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });

            const events = response.data;
            await this.processEvents(events);
            
            return events;
        } catch (error) {
            logger.error(`Error fetching live events: ${error.message}`);
            throw error;
        }
    }

    async fetchEventOdds(eventId) {
        try {
            const response = await axios.get(`${this.baseUrl}/events/${eventId}/odds`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });

            const odds = response.data;
            await this.updateEventOdds(eventId, odds);
            
            return odds;
        } catch (error) {
            logger.error(`Error fetching event odds: ${error.message}`);
            throw error;
        }
    }

    async processEvents(events) {
        try {
            for (const eventData of events) {
                const existingEvent = await Event.findOne({ externalId: eventData.id });

                if (existingEvent) {
                    // Update existing event
                    existingEvent.status = eventData.status;
                    existingEvent.options = eventData.options;
                    await existingEvent.save();

                    // Emit update via WebSocket
                    this.socketService.emitEventUpdate(existingEvent._id, {
                        type: 'EVENT_UPDATE',
                        event: existingEvent
                    });
                } else {
                    // Create new event
                    const newEvent = new Event({
                        externalId: eventData.id,
                        title: eventData.title,
                        description: eventData.description,
                        category: eventData.category,
                        startTime: eventData.startTime,
                        endTime: eventData.endTime,
                        options: eventData.options,
                        status: eventData.status
                    });

                    await newEvent.save();

                    // Emit new event via WebSocket
                    this.socketService.broadcastNotification({
                        type: 'NEW_EVENT',
                        event: newEvent
                    });
                }
            }
        } catch (error) {
            logger.error(`Error processing events: ${error.message}`);
            throw error;
        }
    }

    async updateEventOdds(eventId, odds) {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                throw new Error('Event not found');
            }

            // Update odds for each option
            event.options = event.options.map(option => ({
                ...option,
                odds: odds[option.text] || option.odds
            }));

            await event.save();

            // Emit odds update via WebSocket
            this.socketService.emitOddsUpdate(eventId, event.options);
        } catch (error) {
            logger.error(`Error updating event odds: ${error.message}`);
            throw error;
        }
    }

    // Mock data generation for testing
    generateMockEvent() {
        return {
            id: `mock-${Date.now()}`,
            title: 'Mock Event',
            description: 'This is a mock event for testing',
            category: 'sports',
            startTime: new Date(Date.now() + 3600000), // 1 hour from now
            endTime: new Date(Date.now() + 7200000), // 2 hours from now
            options: [
                { text: 'Option A', odds: 1.5 },
                { text: 'Option B', odds: 2.5 }
            ],
            status: 'upcoming'
        };
    }
}

module.exports = ExternalApiService; 