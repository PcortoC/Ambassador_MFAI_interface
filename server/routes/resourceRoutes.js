const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');

// Routes protégées
router.get('/', auth, resourceController.getResources);
router.get('/:id', auth, resourceController.getResource);
router.post('/:id/complete', auth, resourceController.completeResource);

module.exports = router; 