require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Event = require('../models/event.model');

async function setupTestData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            {
                username: 'admin',
                email: 'admin@example.com',
                password: adminPassword,
                role: 'admin',
                balance: 5000,
                isActive: true
            },
            { upsert: true, new: true }
        );
        
        console.log('Admin user created:', adminUser);

        // Create test events
        const event1 = await Event.findOneAndUpdate(
            { title: 'Football Match: Team A vs Team B' },
            {
                title: 'Football Match: Team A vs Team B',
                description: 'A football match between Team A and Team B',
                category: 'sports',
                startTime: new Date(Date.now() + 3600000), // 1 hour from now
                endTime: new Date(Date.now() + 7200000), // 2 hours from now
                options: [
                    { text: 'Team A Wins', odds: 1.5 },
                    { text: 'Team B Wins', odds: 2.5 },
                    { text: 'Draw', odds: 3.0 }
                ],
                status: 'upcoming',
                createdBy: adminUser._id,
                totalVolume: 0
            },
            { upsert: true, new: true }
        );
        
        console.log('Event 1 created:', event1);

        const event2 = await Event.findOneAndUpdate(
            { title: 'Presidential Election 2024' },
            {
                title: 'Presidential Election 2024',
                description: 'Who will win the upcoming presidential election?',
                category: 'politics',
                startTime: new Date(Date.now() + 86400000), // 1 day from now
                endTime: new Date(Date.now() + 172800000), // 2 days from now
                options: [
                    { text: 'Candidate X', odds: 1.8 },
                    { text: 'Candidate Y', odds: 2.2 }
                ],
                status: 'upcoming',
                createdBy: adminUser._id,
                totalVolume: 0
            },
            { upsert: true, new: true }
        );
        
        console.log('Event 2 created:', event2);

        console.log('Test data setup completed!');
    } catch (error) {
        console.error('Error setting up test data:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

setupTestData(); 