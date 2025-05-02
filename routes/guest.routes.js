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

// CRUD operations
router.post('/', guestController.createGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
