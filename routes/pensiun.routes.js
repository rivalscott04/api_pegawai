const express = require('express');
const router = express.Router();
const pensiunController = require('../controllers/pensiun.controller');
const upload = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get pensiun by NIP
router.get('/pegawai/:nip', pensiunController.getPensiunByNIP);

// Filter pensiun
router.get('/filter', pensiunController.filterPensiun);

// CRUD operations
router.post('/', upload, pensiunController.createPensiun);
router.get('/', pensiunController.getAllPensiun);
router.get('/:id', pensiunController.getPensiunById);
router.put('/:id', upload, pensiunController.updatePensiun);
router.delete('/:id', pensiunController.deletePensiun);

module.exports = router;
