const express = require('express');
const router = express.Router();
const ambassadorController = require('../controllers/ambassadorController');
const auth = require('../middleware/auth');

// Routes publiques
router.post('/inscription', ambassadorController.inscription);
router.post('/connexion', ambassadorController.connexion);

// Routes protégées
router.get('/profil', auth, ambassadorController.getProfil);
router.put('/profil', auth, ambassadorController.updateProfil);
router.get('/statistiques', auth, ambassadorController.getStatistiques);

module.exports = router; 