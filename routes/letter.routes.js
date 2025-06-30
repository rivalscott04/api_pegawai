const express = require('express');
const router = express.Router();
const letterController = require('../controllers/letter.controller');

// List/filter surat
router.get('/api/letters', letterController.listLetters);
// Ambil detail surat
router.get('/api/letters/:id', letterController.getLetter);
// Simpan surat baru
router.post('/api/letters', letterController.createLetter);
// Update surat
router.put('/api/letters/:id', letterController.updateLetter);
// Hapus surat
router.delete('/api/letters/:id', letterController.deleteLetter);

module.exports = router; 