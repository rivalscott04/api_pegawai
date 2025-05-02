const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// Get messages by guest ID
router.get('/guest/:guestId', messageController.getMessagesByGuestId);

// CRUD operations
router.post('/', messageController.createMessage);
router.get('/', messageController.getAllMessages);
router.get('/:id', messageController.getMessageById);
router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
