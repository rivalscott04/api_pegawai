const Pegawai = require('../models/pegawai.model');

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
