const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');

// Get wedding settings
router.get('/', settingController.getSettings);

// Update wedding settings
router.put('/', settingController.updateSettings);

module.exports = router;
