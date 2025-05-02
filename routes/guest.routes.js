const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

// Get attendance statistics
router.get('/stats', guestController.getAttendanceStats);

// Get guest by slug
router.get('/slug/:slug', guestController.getGuestBySlug);

// Mark guest as attended
router.put('/:id/attend', guestController.markAttended);

// CRUD operations
router.post('/', guestController.createGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
