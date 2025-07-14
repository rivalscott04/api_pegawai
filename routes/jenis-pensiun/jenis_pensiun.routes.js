const express = require('express');
const router = express.Router();

// Data jenis pensiun statis
const jenisPensiunData = [
  { id: 1, nama: 'Atas Permintaan Sendiri (APS)' },
  { id: 2, nama: 'Batas Usia Pensiun (BUP)' },
  { id: 3, nama: 'Duda/Janda' }
];

// Get all jenis pensiun (tanpa autentikasi)
router.get('/', (req, res) => {
  return res.status(200).json(jenisPensiunData);
});

module.exports = router;
