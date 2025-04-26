const Pegawai = require('../models/pegawai.model');
const { Sequelize } = require('sequelize');

// Create new pegawai
exports.createPegawai = async (req, res) => {
  try {
    const { nip, nama, golongan, tmt_pensiun, unit_kerja, induk_unit, jabatan } = req.body;
    const newPegawai = await Pegawai.create({ nip, nama, golongan, tmt_pensiun, unit_kerja, induk_unit, jabatan });
    res.status(201).json(newPegawai); // Tidak perlu bungkus dalam {data: newPegawai}
  } catch (err) {
    res.status(500).json({ message: 'Failed to create pegawai', error: err.message });
  }
};

// Read all pegawai
exports.getAllPegawai = async (req, res) => {
  try {
    const pegawaiList = await Pegawai.findAll();
    res.status(200).json(pegawaiList);  // Tidak perlu bungkus dalam {data: pegawaiList}
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pegawai', error: err.message });
  }
};
// jumlah yang sudah pensiun
exports.getRetiredCount = async (req, res) => {
  try {
    console.log('getRetiredCount called with query params:', req.query);
    const currentDate = new Date();

    // Format date for SQL
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Use prepared statements with parameter binding
    const params = [];
    let whereClause = `WHERE tmt_pensiun < ?`;
    params.push(formattedDate);

    // Add filter for induk_unit if provided
    if (req.query.induk_unit) {
      whereClause += ` AND induk_unit = ?`;
      params.push(req.query.induk_unit);
    }

    // Add filter for golongan if provided
    if (req.query.golongan) {
      whereClause += ` AND golongan = ?`;
      params.push(req.query.golongan);
    }

    // Add filter for unit_kerja if provided
    if (req.query.unit_kerja) {
      whereClause += ` AND unit_kerja = ?`;
      params.push(req.query.unit_kerja);
    }

    // Add filter for jabatan if provided
    if (req.query.jabatan) {
      whereClause += ` AND jabatan = ?`;
      params.push(req.query.jabatan);
    }

    console.log('SQL query:', `SELECT COUNT(*) as count FROM pegawai ${whereClause}`);
    console.log('Parameters:', params);

    const { sequelize } = require('../config/db.config');
    const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM pegawai ${whereClause}`, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
      logging: console.log
    });

    const retiredCount = parseInt(results.count, 10);
    console.log('Query result:', retiredCount);

    res.status(200).json({ retiredCount });
  } catch (err) {
    console.error('Error in getRetiredCount:', err);
    res.status(500).json({ message: 'Failed to fetch retired employees count', error: err.message });
  }
};


// Get pegawai by NIP
exports.getPegawaiByNIP = async (req, res) => {
  const { nip } = req.params;
  try {
    const pegawai = await Pegawai.findByPk(nip);
    if (!pegawai) return res.status(404).json({ message: 'Pegawai not found' });
    res.status(200).json(pegawai);  // Tidak perlu bungkus dalam {data: pegawai}
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pegawai', error: err.message });
  }
};

// Update pegawai
exports.updatePegawai = async (req, res) => {
  const { nip } = req.params;
  const { nama, golongan, tmt_pensiun, unit_kerja, induk_unit, jabatan } = req.body;
  try {
    const pegawai = await Pegawai.findByPk(nip);
    if (!pegawai) return res.status(404).json({ message: 'Pegawai not found' });

    pegawai.nama = nama || pegawai.nama;
    pegawai.golongan = golongan || pegawai.golongan;
    pegawai.tmt_pensiun = tmt_pensiun || pegawai.tmt_pensiun;
    pegawai.unit_kerja = unit_kerja || pegawai.unit_kerja;
    pegawai.induk_unit = induk_unit || pegawai.induk_unit;
    pegawai.jabatan = jabatan || pegawai.jabatan;

    await pegawai.save();
    res.status(200).json(pegawai);  // Tidak perlu bungkus dalam {data: pegawai}
  } catch (err) {
    res.status(500).json({ message: 'Failed to update pegawai', error: err.message });
  }
};

// Delete pegawai
exports.deletePegawai = async (req, res) => {
  const { nip } = req.params;
  try {
    const pegawai = await Pegawai.findByPk(nip);
    if (!pegawai) return res.status(404).json({ message: 'Pegawai not found' });
    await pegawai.destroy();
    res.status(200).json({ message: 'Pegawai deleted successfully' });  // Tidak perlu bungkus dalam {data: success message}
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete pegawai', error: err.message });
  }
};
