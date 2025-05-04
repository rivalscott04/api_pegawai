const express = require('express');
const router = express.Router();
const jenisPensiunController = require('../controllers/jenis_pensiun.controller');

// Get all jenis pensiun
router.get('/', jenisPensiunController.getAllJenisPensiun);

module.exports = router;
