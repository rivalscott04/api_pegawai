const Pegawai = require('../../models/pegawai/pegawai.model');
const { Sequelize, Op } = require('sequelize');

// Create new pegawai
exports.createPegawai = async (req, res) => {
  try {
    const { nip, nama, golongan, tmt_pensiun, unit_kerja, induk_unit, jabatan } = req.body;
    const newPegawai = await Pegawai.create({ nip, nama, golongan, tmt_pensiun, unit_kerja, induk_unit, jabatan });
    res.status(201).json(newPegawai);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create pegawai', error: err.message });
  }
};

// Read all pegawai
exports.getAllPegawai = async (req, res) => {
  try {
    // Ambil parameter pagination dan filter
    let { page = 1, limit = 10, golongan, induk_unit, unit_kerja, jabatan, isRetired, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (golongan) {
      whereClause.golongan = { [Op.substring]: golongan };
    }
    if (induk_unit) {
      whereClause.induk_unit = { [Op.substring]: induk_unit };
    }
    if (unit_kerja) {
      whereClause.unit_kerja = { [Op.substring]: unit_kerja };
    }
    if (jabatan) {
      whereClause.jabatan = { [Op.substring]: jabatan };
    }
    if (isRetired === 'true') {
      whereClause.tmt_pensiun = { [Op.lt]: new Date() };
    } else if (isRetired === 'false') {
      whereClause.tmt_pensiun = { [Op.gte]: new Date() };
    }
    if (search) {
      whereClause[Op.or] = [
        { nama: { [Op.substring]: search } },
        { nip: { [Op.substring]: search } }
      ];
    }

    // Hitung total hasil filter
    const total = await Pegawai.count({ where: whereClause });
    const totalPages = Math.ceil(total / limit);

    // Hitung jumlah pensiun (retired) sesuai filter
    const retiredWhere = { ...whereClause, tmt_pensiun: { [Op.lt]: new Date() } };
    const retired = await Pegawai.count({ where: retiredWhere });
    const active = total - retired;

    // Ambil data dengan pagination
    const data = await Pegawai.findAll({
      where: whereClause,
      order: [['nama', 'ASC']],
      offset,
      limit
    });

    return res.status(200).json({
      data,
      total,
      retired,
      active,
      totalPages,
      page,
      limit
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pegawai', error: err.message });
  }
};

// Filter pegawai (redirect ke getAllPegawai agar response konsisten)
exports.filterPegawai = async (req, res) => {
  return exports.getAllPegawai(req, res);
};

// Get jumlah pensiunan
exports.getRetiredCount = async (req, res) => {
  try {
    console.log('getRetiredCount called with query params:', req.query);

    const whereClause = {
      tmt_pensiun: { [Op.lt]: new Date() }
    };

    if (req.query.induk_unit) {
      whereClause.induk_unit = {
        [Op.substring]: req.query.induk_unit
      };
    }

    if (req.query.golongan) {
      whereClause.golongan = {
        [Op.substring]: req.query.golongan
      };
    }

    if (req.query.unit_kerja) {
      whereClause.unit_kerja = {
        [Op.substring]: req.query.unit_kerja
      };
    }

    if (req.query.jabatan) {
      whereClause.jabatan = {
        [Op.substring]: req.query.jabatan
      };
    }

    console.log('Filter where clause:', JSON.stringify(whereClause, null, 2));

    const retiredCount = await Pegawai.count({
      where: whereClause
    });

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
    res.status(200).json(pegawai);
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
    res.status(200).json(pegawai);
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
    res.status(200).json({ message: 'Pegawai deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete pegawai', error: err.message });
  }
};

// Get tempat kerja (combined induk_unit and unit_kerja)
exports.getTempatKerja = async (req, res) => {
  try {
    console.log('getTempatKerja called with query params:', req.query);

    const whereClause = {};

    // Add filters if provided in query params
    if (req.query.nip) {
      whereClause.nip = {
        [Op.substring]: req.query.nip
      };
    }

    if (req.query.induk_unit) {
      whereClause.induk_unit = {
        [Op.substring]: req.query.induk_unit
      };
    }

    if (req.query.unit_kerja) {
      whereClause.unit_kerja = {
        [Op.substring]: req.query.unit_kerja
      };
    }

    if (req.query.golongan) {
      whereClause.golongan = {
        [Op.substring]: req.query.golongan
      };
    }

    if (req.query.jabatan) {
      whereClause.jabatan = {
        [Op.substring]: req.query.jabatan
      };
    }

    if (req.query.nama) {
      whereClause.nama = {
        [Op.substring]: req.query.nama
      };
    }

    if (req.query.isRetired === 'true') {
      whereClause.tmt_pensiun = {
        [Op.lt]: new Date()
      };
    } else if (req.query.isRetired === 'false') {
      whereClause.tmt_pensiun = {
        [Op.gte]: new Date()
      };
    }

    // Get all pegawai with the applied filters
    const pegawaiList = await Pegawai.findAll({
      where: whereClause,
      order: [['nama', 'ASC']]
    });

    // Transform the data to combine induk_unit and unit_kerja
    const tempatKerjaList = pegawaiList.map(pegawai => {
      const { nip, nama, golongan, tmt_pensiun, induk_unit, unit_kerja, jabatan } = pegawai;
      return {
        nip,
        nama,
        golongan,
        tmt_pensiun,
        induk_unit,
        unit_kerja,
        jabatan,
        tempat_kerja: `${induk_unit} - ${unit_kerja}`
      };
    });

    res.status(200).json(tempatKerjaList);
  } catch (err) {
    console.error('Error in getTempatKerja:', err);
    res.status(500).json({ message: 'Failed to fetch tempat kerja data', error: err.message });
  }
};

// === Pencarian Pegawai untuk Surat (Best Practice) ===
exports.searchPegawaiForSurat = async (req, res) => {
  try {
    const { nip, nama } = req.query;
    const whereClause = {};
    // Validasi minimal panjang query
    if (nip && nip.length >= 4) {
      whereClause.nip = { [Op.startsWith]: nip };
    } else if (nama && nama.length >= 4) {
      whereClause.nama = { [Op.substring]: nama };
    } else {
      // Query terlalu pendek/kosong, return array kosong
      return res.status(200).json([]);
    }
    // Selalu pakai LIMIT
    const pegawaiList = await Pegawai.findAll({
      where: whereClause,
      order: [['nama', 'ASC']],
      limit: 20,
    });
    res.status(200).json(pegawaiList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search pegawai', error: err.message });
  }
};
// === End Pencarian Pegawai untuk Surat ===
