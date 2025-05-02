const express = require('express');
const router = express.Router();
const guestRoutes = require('./guest.routes');
const messageRoutes = require('./message.routes');
const settingRoutes = require('./setting.routes');

// Mount the routes
router.use('/guests', guestRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingRoutes);

module.exports = router;
