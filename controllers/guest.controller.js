const Guest = require('../models/guest.model');
const { Op } = require('sequelize');

// Create a new guest
exports.createGuest = async (req, res) => {
  try {
    const { name, slug, status, attended } = req.body;
    const newGuest = await Guest.create({ 
      name, 
      slug, 
      status: status || 'active', 
      attended: attended || false 
    });
    res.status(201).json(newGuest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create guest', error: err.message });
  }
};

// Get all guests
exports.getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll({
      order: [['name', 'ASC']]
    });
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guests', error: err.message });
  }
};

// Get guest by ID
exports.getGuestById = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByPk(id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guest', error: err.message });
  }
};

// Get guest by slug
exports.getGuestBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const guest = await Guest.findOne({
      where: { slug }
    });
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guest', error: err.message });
  }
};

// Update guest
exports.updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, status, attended } = req.body;
    
    const guest = await Guest.findByPk(id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    // Update fields
    if (name) guest.name = name;
    if (slug) guest.slug = slug;
    if (status) guest.status = status;
    if (attended !== undefined) guest.attended = attended;
    
    // Update the updated_at timestamp
    guest.updated_at = new Date();
    
    await guest.save();
    
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update guest', error: err.message });
  }
};

// Delete guest
exports.deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const guest = await Guest.findByPk(id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    await guest.destroy();
    
    res.status(200).json({ message: 'Guest deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete guest', error: err.message });
  }
};

// Mark guest as attended
exports.markAttended = async (req, res) => {
  try {
    const { id } = req.params;
    
    const guest = await Guest.findByPk(id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    guest.attended = true;
    guest.updated_at = new Date();
    
    await guest.save();
    
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark guest as attended', error: err.message });
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const totalGuests = await Guest.count();
    const attendedGuests = await Guest.count({ where: { attended: true } });
    const activeGuests = await Guest.count({ where: { status: 'active' } });
    
    res.status(200).json({
      total: totalGuests,
      attended: attendedGuests,
      active: activeGuests,
      attendanceRate: totalGuests > 0 ? (attendedGuests / totalGuests * 100).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance statistics', error: err.message });
  }
};
