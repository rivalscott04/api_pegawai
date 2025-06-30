const { Letter, LetterEmployee, LetterSignature } = require('../models');
const { Op } = require('sequelize');

// Create new letter
exports.createLetter = async (req, res) => {
  try {
    const { letter_type, nomor_surat, tanggal_surat, perihal, content, employees, signatures, created_by } = req.body;
    // Validasi field wajib
    if (!letter_type || !nomor_surat || !tanggal_surat || !perihal || !content || !created_by) {
      return res.status(400).json({ message: 'Field wajib tidak boleh kosong' });
    }
    // Buat surat
    const newLetter = await Letter.create({
      letter_type, nomor_surat, tanggal_surat, perihal, content, created_by,
      created_at: new Date(),
      updated_at: new Date(),
    });
    // Bulk insert employees
    if (Array.isArray(employees) && employees.length > 0) {
      const empData = employees.map(e => ({ ...e, letter_id: newLetter.id }));
      await LetterEmployee.bulkCreate(empData);
    }
    // Bulk insert signatures
    if (Array.isArray(signatures) && signatures.length > 0) {
      const sigData = signatures.map(s => ({ ...s, letter_id: newLetter.id }));
      await LetterSignature.bulkCreate(sigData);
    }
    // Ambil detail lengkap
    const detail = await exports.getLetterDetailById(newLetter.id);
    res.status(201).json(detail);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat surat', error: err.message });
  }
};

// Helper ambil detail surat by id
exports.getLetterDetailById = async (id) => {
  const letter = await Letter.findByPk(id);
  if (!letter) return null;
  const employees = await LetterEmployee.findAll({ where: { letter_id: id } });
  const signatures = await LetterSignature.findAll({ where: { letter_id: id }, order: [['urutan', 'ASC']] });
  return {
    ...letter.toJSON(),
    employees,
    signatures,
  };
};

// Get letter detail
exports.getLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await exports.getLetterDetailById(id);
    if (!detail) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.status(200).json(detail);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail surat', error: err.message });
  }
};

// Update letter
exports.updateLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { letter_type, nomor_surat, tanggal_surat, perihal, content, employees, signatures } = req.body;
    const letter = await Letter.findByPk(id);
    if (!letter) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    // Update surat
    await letter.update({
      letter_type, nomor_surat, tanggal_surat, perihal, content,
      updated_at: new Date(),
    });
    // Update employees: hapus lalu insert ulang
    await LetterEmployee.destroy({ where: { letter_id: id } });
    if (Array.isArray(employees) && employees.length > 0) {
      const empData = employees.map(e => ({ ...e, letter_id: id }));
      await LetterEmployee.bulkCreate(empData);
    }
    // Update signatures: hapus lalu insert ulang
    await LetterSignature.destroy({ where: { letter_id: id } });
    if (Array.isArray(signatures) && signatures.length > 0) {
      const sigData = signatures.map(s => ({ ...s, letter_id: id }));
      await LetterSignature.bulkCreate(sigData);
    }
    // Ambil detail lengkap
    const detail = await exports.getLetterDetailById(id);
    res.status(200).json(detail);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update surat', error: err.message });
  }
};

// Delete letter
exports.deleteLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const letter = await Letter.findByPk(id);
    if (!letter) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    await LetterEmployee.destroy({ where: { letter_id: id } });
    await LetterSignature.destroy({ where: { letter_id: id } });
    await letter.destroy();
    res.status(200).json({ message: 'Surat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus surat', error: err.message });
  }
};

// List/filter surat
exports.listLetters = async (req, res) => {
  try {
    const where = {};
    if (req.query.type) where.letter_type = req.query.type;
    if (req.query.tanggal) where.tanggal_surat = req.query.tanggal;
    // Bisa tambah filter lain sesuai kebutuhan
    const letters = await Letter.findAll({ where, order: [['created_at', 'DESC']] });
    // Ambil detail relasi
    const result = await Promise.all(letters.map(async (l) => exports.getLetterDetailById(l.id)));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil daftar surat', error: err.message });
  }
}; 