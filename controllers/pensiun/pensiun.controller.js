const Pensiun = require('../../models/pensiun/pensiun.model');
const Pegawai = require('../../models/pegawai/pegawai.model');
const JenisPensiun = require('../../models/jenis-pensiun/jenis_pensiun.model');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Create new pensiun
exports.createPensiun = async (req, res) => {
  try {
    // Check if file size exceeds limit (handled by multer, but adding a custom message)
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { nip, jenis_pensiun_id, status } = req.body;

    // Check if pegawai exists
    const pegawai = await Pegawai.findByPk(nip);
    if (!pegawai) {
      return res.status(404).json({ message: 'Pegawai not found' });
    }

    // Check if jenis_pensiun exists
    const jenisPensiun = await JenisPensiun.findByPk(jenis_pensiun_id);
    if (!jenisPensiun) {
      return res.status(404).json({ message: 'Jenis pensiun not found' });
    }

    // Check if there's already a pension record for this employee
    const existingPensiun = await Pensiun.findOne({ where: { nip } });
    if (existingPensiun) {
      return res.status(400).json({ message: 'Pension record already exists for this employee' });
    }

    // Handle file upload if present
    let berkas = null;
    if (req.file) {
      berkas = req.file.filename;
    }

    const newPensiun = await Pensiun.create({
      nip,
      jenis_pensiun_id,
      status: status || 'diajukan',
      berkas,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Get the created record with associations
    const pensiunWithDetails = await Pensiun.findByPk(newPensiun.id, {
      include: [
        { model: Pegawai },
        { model: JenisPensiun }
      ]
    });

    res.status(201).json(pensiunWithDetails);
  } catch (err) {
    console.error('Error in createPensiun:', err);
    res.status(500).json({ message: 'Failed to create pension record', error: err.message });
  }
};

// Get all pensiun records
exports.getAllPensiun = async (req, res) => {
  try {
    // If query params exist, use filter function
    if (Object.keys(req.query).length > 0) {
      return exports.filterPensiun(req, res);
    }

    const pensiunList = await Pensiun.findAll({
      include: [
        { model: Pegawai },
        { model: JenisPensiun }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(pensiunList);
  } catch (err) {
    console.error('Error in getAllPensiun:', err);
    res.status(500).json({ message: 'Failed to fetch pension records', error: err.message });
  }
};

// Filter pensiun records
exports.filterPensiun = async (req, res) => {
  try {
    console.log('filterPensiun called with query params:', req.query);

    const whereClause = {};
    const pegawaiWhereClause = {};

    // Filter by NIP
    if (req.query.nip) {
      whereClause.nip = {
        [Op.substring]: req.query.nip
      };
    }

    // Filter by jenis_pensiun_id
    if (req.query.jenis_pensiun_id) {
      whereClause.jenis_pensiun_id = req.query.jenis_pensiun_id;
    }

    // Filter by status
    if (req.query.status) {
      whereClause.status = req.query.status;
    }

    // Filter by pegawai attributes
    if (req.query.nama) {
      pegawaiWhereClause.nama = {
        [Op.substring]: req.query.nama
      };
    }

    if (req.query.golongan) {
      pegawaiWhereClause.golongan = {
        [Op.substring]: req.query.golongan
      };
    }

    if (req.query.induk_unit) {
      pegawaiWhereClause.induk_unit = {
        [Op.substring]: req.query.induk_unit
      };
    }

    if (req.query.unit_kerja) {
      pegawaiWhereClause.unit_kerja = {
        [Op.substring]: req.query.unit_kerja
      };
    }

    console.log('Final whereClause:', whereClause);
    console.log('Pegawai whereClause:', pegawaiWhereClause);

    const filteredPensiun = await Pensiun.findAll({
      where: whereClause,
      include: [
        {
          model: Pegawai,
          where: Object.keys(pegawaiWhereClause).length > 0 ? pegawaiWhereClause : undefined
        },
        { model: JenisPensiun }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(filteredPensiun);
  } catch (err) {
    console.error('Error in filterPensiun:', err);
    res.status(500).json({ message: 'Failed to filter pension records', error: err.message });
  }
};

// Get pensiun by ID
exports.getPensiunById = async (req, res) => {
  try {
    const { id } = req.params;

    const pensiun = await Pensiun.findByPk(id, {
      include: [
        { model: Pegawai },
        { model: JenisPensiun }
      ]
    });

    if (!pensiun) {
      return res.status(404).json({ message: 'Pension record not found' });
    }

    res.status(200).json(pensiun);
  } catch (err) {
    console.error('Error in getPensiunById:', err);
    res.status(500).json({ message: 'Failed to fetch pension record', error: err.message });
  }
};

// Get pensiun by NIP
exports.getPensiunByNIP = async (req, res) => {
  try {
    const { nip } = req.params;

    const pensiun = await Pensiun.findOne({
      where: { nip },
      include: [
        { model: Pegawai },
        { model: JenisPensiun }
      ]
    });

    if (!pensiun) {
      return res.status(404).json({ message: 'Pension record not found for this employee' });
    }

    res.status(200).json(pensiun);
  } catch (err) {
    console.error('Error in getPensiunByNIP:', err);
    res.status(500).json({ message: 'Failed to fetch pension record', error: err.message });
  }
};

// Update pensiun
exports.updatePensiun = async (req, res) => {
  try {
    // Check if file size exceeds limit (handled by multer, but adding a custom message)
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { id } = req.params;
    const { jenis_pensiun_id, status } = req.body;

    const pensiun = await Pensiun.findByPk(id);
    if (!pensiun) {
      return res.status(404).json({ message: 'Pension record not found' });
    }

    // Update fields if provided
    if (jenis_pensiun_id) {
      // Check if jenis_pensiun exists
      const jenisPensiun = await JenisPensiun.findByPk(jenis_pensiun_id);
      if (!jenisPensiun) {
        return res.status(404).json({ message: 'Jenis pensiun not found' });
      }
      pensiun.jenis_pensiun_id = jenis_pensiun_id;
    }

    if (status) {
      pensiun.status = status;
    }

    // Handle file upload if present
    if (req.file) {
      // Delete old file if exists
      if (pensiun.berkas) {
        const oldFilePath = path.join(__dirname, '../uploads', pensiun.berkas);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      pensiun.berkas = req.file.filename;
    }

    pensiun.updated_at = new Date();
    await pensiun.save();

    // Get the updated record with associations
    const updatedPensiun = await Pensiun.findByPk(id, {
      include: [
        { model: Pegawai },
        { model: JenisPensiun }
      ]
    });

    res.status(200).json(updatedPensiun);
  } catch (err) {
    console.error('Error in updatePensiun:', err);
    res.status(500).json({ message: 'Failed to update pension record', error: err.message });
  }
};

// Delete pensiun
exports.deletePensiun = async (req, res) => {
  try {
    const { id } = req.params;

    const pensiun = await Pensiun.findByPk(id);
    if (!pensiun) {
      return res.status(404).json({ message: 'Pension record not found' });
    }

    // Delete file if exists
    if (pensiun.berkas) {
      const filePath = path.join(__dirname, '../uploads', pensiun.berkas);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pensiun.destroy();
    res.status(200).json({ message: 'Pension record deleted successfully' });
  } catch (err) {
    console.error('Error in deletePensiun:', err);
    res.status(500).json({ message: 'Failed to delete pension record', error: err.message });
  }
};
