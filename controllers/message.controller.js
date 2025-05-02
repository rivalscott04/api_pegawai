const Message = require('../models/message.model');
const Guest = require('../models/guest.model');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { guest_id, name, message, is_attending } = req.body;

    // If guest_id is provided, verify that the guest exists and update attendance
    if (guest_id) {
      const guest = await Guest.findByPk(guest_id);
      if (!guest) {
        return res.status(404).json({ message: 'Guest not found' });
      }

      // Update guest attendance status if is_attending is provided
      if (is_attending !== undefined) {
        guest.attended = is_attending;
        guest.updated_at = new Date();
        await guest.save();
      }
    }

    const newMessage = await Message.create({
      guest_id,
      name,
      message,
      is_attending,
      created_at: new Date()
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create message', error: err.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{ model: Guest, attributes: ['id', 'name', 'slug'] }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id, {
      include: [{ model: Guest, attributes: ['id', 'name', 'slug'] }]
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch message', error: err.message });
  }
};

// Get messages by guest ID
exports.getMessagesByGuestId = async (req, res) => {
  try {
    const { guestId } = req.params;

    // Verify that the guest exists
    const guest = await Guest.findByPk(guestId);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    const messages = await Message.findAll({
      where: { guest_id: guestId },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// Update message
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { guest_id, name, message, is_attending } = req.body;

    const messageRecord = await Message.findByPk(id);

    if (!messageRecord) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // If guest_id is provided, verify that the guest exists
    if (guest_id) {
      const guest = await Guest.findByPk(guest_id);
      if (!guest) {
        return res.status(404).json({ message: 'Guest not found' });
      }
      messageRecord.guest_id = guest_id;
    }

    if (name) messageRecord.name = name;
    if (message) messageRecord.message = message;
    if (is_attending !== undefined) messageRecord.is_attending = is_attending;

    await messageRecord.save();

    res.status(200).json(messageRecord);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update message', error: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.destroy();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', error: err.message });
  }
};
