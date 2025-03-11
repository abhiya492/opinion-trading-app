const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        logger.error(`Auth Middleware Error: ${error.message}`);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            next();
        });
    } catch (error) {
        logger.error(`Admin Auth Middleware Error: ${error.message}`);
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { auth, adminAuth }; 