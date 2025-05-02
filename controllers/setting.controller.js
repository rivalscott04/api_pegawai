const Setting = require('../models/setting.model');

// Get wedding settings
exports.getSettings = async (req, res) => {
  try {
    // Get the first record (there should only be one)
    const settings = await Setting.findOne();
    
    if (!settings) {
      return res.status(404).json({ message: 'Wedding settings not found' });
    }
    
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wedding settings', error: err.message });
  }
};

// Update wedding settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      bride_name,
      groom_name,
      wedding_date,
      akad_time,
      reception_time,
      venue_name,
      venue_address,
      venue_map_link
    } = req.body;
    
    // Get the first record (there should only be one)
    let settings = await Setting.findOne();
    
    if (!settings) {
      // If no settings exist, create a new one
      settings = await Setting.create({
        bride_name,
        groom_name,
        wedding_date,
        akad_time,
        reception_time,
        venue_name,
        venue_address,
        venue_map_link,
        updated_at: new Date()
      });
      
      return res.status(201).json(settings);
    }
    
    // Update fields
    if (bride_name) settings.bride_name = bride_name;
    if (groom_name) settings.groom_name = groom_name;
    if (wedding_date) settings.wedding_date = wedding_date;
    if (akad_time !== undefined) settings.akad_time = akad_time;
    if (reception_time !== undefined) settings.reception_time = reception_time;
    if (venue_name !== undefined) settings.venue_name = venue_name;
    if (venue_address !== undefined) settings.venue_address = venue_address;
    if (venue_map_link !== undefined) settings.venue_map_link = venue_map_link;
    
    // Update the updated_at timestamp
    settings.updated_at = new Date();
    
    await settings.save();
    
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update wedding settings', error: err.message });
  }
};
