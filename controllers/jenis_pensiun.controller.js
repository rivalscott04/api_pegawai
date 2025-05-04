const JenisPensiun = require('../models/jenis_pensiun.model');

// Get all jenis pensiun
exports.getAllJenisPensiun = async (req, res) => {
  try {
    const jenisPensiunList = await JenisPensiun.findAll({
      order: [['nama', 'ASC']]
    });
    res.status(200).json(jenisPensiunList);
  } catch (err) {
    console.error('Error in getAllJenisPensiun:', err);
    res.status(500).json({ message: 'Failed to fetch jenis pensiun', error: err.message });
  }
};

// Initialize default jenis pensiun data
exports.initializeJenisPensiun = async () => {
  try {
    const count = await JenisPensiun.count();
    
    // Only initialize if the table is empty
    if (count === 0) {
      const defaultTypes = [
        { nama: 'Atas Permintaan Sendiri (APS)' },
        { nama: 'Batas Usia Pensiun (BUP)' },
        { nama: 'Duda/Janda' }
      ];
      
      await JenisPensiun.bulkCreate(defaultTypes);
      console.log('Default jenis pensiun initialized successfully');
    }
  } catch (err) {
    console.error('Error initializing jenis pensiun:', err);
  }
};
