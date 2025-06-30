const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawai.controller');

// Specific routes first (order matters in Express)
router.get('/retired-count', pegawaiController.getRetiredCount);
router.get('/filter', pegawaiController.filterPegawai);
router.get('/tempat-kerja', pegawaiController.getTempatKerja);

// Create
router.post('/', pegawaiController.createPegawai);

// Read
router.get('/', pegawaiController.getAllPegawai);

// Update
router.put('/:nip', pegawaiController.updatePegawai);

// Delete
router.delete('/:nip', pegawaiController.deletePegawai);

// Get by NIP (put this last to avoid catching other routes)
router.get('/search-surat', pegawaiController.searchPegawaiForSurat);
router.get('/:nip', pegawaiController.getPegawaiByNIP);

module.exports = router;
