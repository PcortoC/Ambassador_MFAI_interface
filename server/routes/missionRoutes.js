const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const auth = require('../middleware/auth');

// Routes protégées
router.get('/disponibles', auth, missionController.getMissionsDisponibles);
router.get('/:id', auth, missionController.getMission);
router.post('/:id/completer', auth, missionController.completerMission);
router.get('/historique', auth, missionController.getHistoriqueMissions);

// Routes d'administration (à protéger avec un middleware admin)
router.post('/', auth, missionController.creerMission);
router.put('/:id', auth, missionController.updateMission);
router.delete('/:id', auth, missionController.supprimerMission);

module.exports = router; 