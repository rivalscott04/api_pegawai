const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawai.controller');

// Khusus untuk route retired-count
router.get('/retired-count', pegawaiController.getRetiredCount);

// Create
router.post('/', pegawaiController.createPegawai);

// Read
router.get('/', pegawaiController.getAllPegawai);
router.get('/:nip', pegawaiController.getPegawaiByNIP);

// Update
router.put('/:nip', pegawaiController.updatePegawai);

// Delete
router.delete('/:nip', pegawaiController.deletePegawai);
module.exports = router;
