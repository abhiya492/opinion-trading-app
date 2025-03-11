require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const logger = require('./config/logger');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const tradeRoutes = require('./routes/trade.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/admin', adminRoutes);

// Direct health check endpoint (in addition to the one in routes)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

// Start the server with port retry logic
const startServer = (port) => {
  server.listen(port)
    .on('listening', () => {
      logger.info(`Server is running on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const nextPort = port + 1;
        logger.warn(`Port ${port} is busy. Trying port ${nextPort}...`);
        startServer(nextPort);
      } else {
        logger.error(`Server error: ${err.message}`);
        process.exit(1);
      }
    });
};

// Start server with retry logic
startServer(PORT);

// Export for testing purposes
module.exports = { app, server, io }; 