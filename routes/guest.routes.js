const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

// Get attendance statistics
router.get('/stats', guestController.getAttendanceStats);

// Get guest by slug
router.get('/slug/:slug', guestController.getGuestBySlug);

// Attendance endpoints
router.put('/:id/attend', guestController.markAttended);
router.put('/:id/not-attend', guestController.markNotAttending);
router.put('/slug/:slug/attendance', guestController.updateAttendanceBySlug);

// Add additional routes to match the URL structure being used
router.post('/slug/:slug/attendance', guestController.updateAttendanceBySlug);

// Direct routes without the 'slug' segment in the path
router.put('/:slug/attendance', guestController.updateAttendanceBySlug);
router.post('/:slug/attendance', guestController.updateAttendanceBySlug);

// Handle OPTIONS requests explicitly
router.options('/:slug/attendance', (req, res) => {
  console.log('Handling OPTIONS request for guest attendance');
  res.status(200).end();
});

// Debug route to test if the route is accessible
router.get('/debug', (req, res) => {
  res.status(200).json({
    message: 'Debug route is working',
    routes: {
      getBySlug: '/slug/:slug',
      updateAttendance: [
        '/slug/:slug/attendance (PUT or POST)',
        '/:slug/attendance (PUT or POST)' // New direct route
      ],
      markAttended: '/:id/attend (PUT)',
      markNotAttending: '/:id/not-attend (PUT)'
    }
  });
});

// CRUD operations
router.post('/', guestController.createGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
