const logger = require('../config/logger');

class SocketService {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);

            // Handle authentication
            socket.on('authenticate', (token) => {
                try {
                    // Store user connection
                    this.connectedUsers.set(socket.id, { token });
                    socket.join('authenticated');
                    logger.info(`User authenticated: ${socket.id}`);
                } catch (error) {
                    logger.error(`Socket authentication error: ${error.message}`);
                }
            });

            // Join event room
            socket.on('join-event', (eventId) => {
                socket.join(`event-${eventId}`);
                logger.info(`Client ${socket.id} joined event: ${eventId}`);
            });

            // Leave event room
            socket.on('leave-event', (eventId) => {
                socket.leave(`event-${eventId}`);
                logger.info(`Client ${socket.id} left event: ${eventId}`);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                this.connectedUsers.delete(socket.id);
                logger.info(`Client disconnected: ${socket.id}`);
            });
        });
    }

    // Emit event updates to all clients watching an event
    emitEventUpdate(eventId, data) {
        this.io.to(`event-${eventId}`).emit('event-update', data);
    }

    // Emit trade updates to specific user
    emitTradeUpdate(userId, data) {
        this.io.to(`user-${userId}`).emit('trade-update', data);
    }

    // Broadcast system-wide notifications
    broadcastNotification(data) {
        this.io.to('authenticated').emit('notification', data);
    }

    // Emit odds updates for an event
    emitOddsUpdate(eventId, odds) {
        this.io.to(`event-${eventId}`).emit('odds-update', odds);
    }

    // Get number of connected clients
    getConnectedClientsCount() {
        return this.connectedUsers.size;
    }
}

module.exports = SocketService; 