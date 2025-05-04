const express = require('express');
const router = express.Router();
const guestRoutes = require('./guest.routes');
const messageRoutes = require('./message.routes');
const settingRoutes = require('./setting.routes');
const guestController = require('../controllers/guest.controller');

// Direct attendance update route to bypass any potential routing issues
router.put('/guests/:slug/attendance', guestController.updateAttendanceBySlug);
router.post('/guests/:slug/attendance', guestController.updateAttendanceBySlug);
router.options('/guests/:slug/attendance', (req, res) => {
  console.log('Handling OPTIONS request for direct attendance endpoint');

  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  res.status(200).end();
});

// Mount the routes
router.use('/guests', guestRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingRoutes);

module.exports = router;
